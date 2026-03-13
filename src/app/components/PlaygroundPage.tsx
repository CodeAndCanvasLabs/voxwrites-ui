'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  RotateCcw,
  Mic,
  MicOff,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { enhanceApi, promptsApi, snippetsApi, transcriptionsApi, type AppType, type Snippet } from '../../lib/api';
import { AppTypeIcon } from '../../lib/icon-map';

interface PlaygroundPageProps {
  token: string | null;
}

const TONES = ['Professional', 'Casual', 'Formal', 'Friendly', 'Technical', 'Creative'];

export function PlaygroundPage({ token }: PlaygroundPageProps) {
  const [inputText, setInputText] = useState('');
  const [enhancedText, setEnhancedText] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedAppType, setSelectedAppType] = useState('other');
  const [appTypes, setAppTypes] = useState<AppType[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mic state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const baseTextRef = useRef('');

  // Snippets state
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [showSnippets, setShowSnippets] = useState(false);
  const snippetsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const types = await promptsApi.getAppTypes();
        setAppTypes(types);
      } catch {
        // Fallback handled by default select items
      }

      // Load snippets if token available
      if (token) {
        try {
          const result = await snippetsApi.list(token);
          setSnippets(result.snippets.filter(s => s.is_active));
        } catch {
          // Snippets not critical
        }
      }
    };
    loadData();
  }, [token]);

  // Close snippets dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (snippetsDropdownRef.current && !snippetsDropdownRef.current.contains(e.target as Node)) {
        setShowSnippets(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Speech recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Capture current text as base before starting
    baseTextRef.current = inputText;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Rebuild full transcript from ALL results (final + interim)
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const fullTranscript = finalTranscript + interimTranscript;
      const base = baseTextRef.current;
      setInputText(base + (base ? ' ' : '') + fullTranscript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, inputText]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const insertSnippet = (snippet: Snippet) => {
    setInputText(prev => prev + (prev ? ' ' : '') + snippet.content);
    setShowSnippets(false);
  };

  const handleEnhance = async () => {
    if (!inputText.trim()) return;

    setIsEnhancing(true);
    setError(null);
    try {
      const response = await enhanceApi.enhance({
        text: inputText,
        app_type: selectedAppType,
        remove_filler_words: true,
      }, token || undefined);

      setEnhancedText(response.enhanced);

      // Save to history with both original and enhanced text
      if (token) {
        try {
          await transcriptionsApi.create(token, {
            text: inputText,
            enhanced_text: response.enhanced,
            app_type: selectedAppType,
            word_count: inputText.trim().split(/\s+/).filter(Boolean).length,
          });
        } catch {
          // Silent fail — playground save is best-effort
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Enhancement failed';
      setError(message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = async () => {
    const text = enhancedText || inputText;
    if (!text) return;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    // Stop listening if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    baseTextRef.current = '';
    setInputText('');
    setEnhancedText('');
    setError(null);
  };

  return (
    <div>
      {/* Sticky Header + Controls */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Playground</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Paste or type text, then enhance it with AI
          </p>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">App Context</label>
              <Select value={selectedAppType} onValueChange={setSelectedAppType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appTypes.length > 0 ? (
                    appTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="inline-flex items-center gap-1.5"><AppTypeIcon name={type.icon} size={14} /> {type.label}</span>
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="docs">Documents</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="other">General</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((tone) => (
                    <SelectItem key={tone.toLowerCase()} value={tone.toLowerCase()}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Input / Output */}
      <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Input</h3>
            <div className="flex items-center gap-2">
              {/* Snippet selector */}
              {snippets.length > 0 && (
                <div className="relative" ref={snippetsDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSnippets(!showSnippets)}
                    className="text-xs"
                  >
                    <Zap className="w-3 h-3 mr-1 text-orange-500" />
                    Snippets
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                  <AnimatePresence>
                    {showSnippets && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                      >
                        {snippets.map((snippet) => (
                          <button
                            key={snippet.id}
                            onClick={() => insertSnippet(snippet)}
                            className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                          >
                            <p className="text-sm font-medium truncate">{snippet.trigger_phrase}</p>
                            <p className="text-xs text-slate-500 truncate">{snippet.content}</p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <span className="text-xs text-slate-500">
                {inputText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>
          <div className="relative">
            <Textarea
              placeholder="Paste or type your text here... e.g. voice transcription, rough draft, notes"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // Keep baseTextRef in sync when user types/clears manually while listening
                if (isListening) {
                  baseTextRef.current = e.target.value;
                }
              }}
              className="min-h-[240px] resize-none pr-16"
            />
            {/* Mic button */}
            <button
              onClick={toggleListening}
              className={`absolute right-3 top-3 rounded-full w-11 h-11 flex items-center justify-center transition-all shadow-md ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse shadow-red-200 dark:shadow-red-900/40'
                  : 'bg-gradient-to-br from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 shadow-orange-200 dark:shadow-orange-900/40'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          {isListening && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Listening... speak now
            </p>
          )}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!inputText && !enhancedText}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={handleEnhance}
              disabled={isEnhancing || !inputText.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance with AI
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Output */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Enhanced Output</h3>
            {enhancedText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          {error && (
            <div className="p-3 mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {enhancedText ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Textarea
                value={enhancedText}
                onChange={(e) => setEnhancedText(e.target.value)}
                className="min-h-[240px] resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-slate-500">
                  {enhancedText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            </motion.div>
          ) : (
            <div className="min-h-[240px] flex items-center justify-center text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Enhanced text will appear here</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
