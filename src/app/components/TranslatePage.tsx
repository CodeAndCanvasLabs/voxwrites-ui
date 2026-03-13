'use client';

import { useState, useEffect } from 'react';
import { Button, buttonVariants } from './ui/button';
import { cn } from './ui/utils';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Languages,
  ArrowRight,
  ArrowLeftRight,
  Copy,
  Check,
  Loader2,
  Sparkles,
  FileText,
  Mic,
  MicOff,
  ChevronsUpDown,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './ui/command';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import {
  translateApi,
  meetingApi,
  type Language,
  type MeetingSummary,
} from '../../lib/api';

interface TranslatePageProps {
  token: string | null;
}

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
];

export function TranslatePage({ token }: TranslatePageProps) {
  const [activeMode, setActiveMode] = useState<'translate' | 'meeting'>('translate');

  // Translation state
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Languages
  const [languages, setLanguages] = useState<Language[]>(POPULAR_LANGUAGES);

  // Meeting notes state
  const [meetingText, setMeetingText] = useState('');
  const [meetingSummary, setMeetingSummary] = useState<MeetingSummary | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [meetingCopied, setMeetingCopied] = useState(false);

  // Mic state
  const [isListening, setIsListening] = useState(false);

  // Language search popover state
  const [sourceOpen, setSourceOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langs = await translateApi.getSupportedLanguages();
        if (langs.length > 0) {
          setLanguages(langs);
        }
      } catch {
        // Use fallback popular languages
      }
    };
    loadLanguages();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setError(null);
    setDetectedLanguage(null);

    try {
      const sourceName = sourceLanguage === 'auto' ? undefined : getLanguageName(sourceLanguage);
      const targetName = getLanguageName(targetLanguage);
      const result = await translateApi.translate(inputText, targetName, sourceName, token || undefined);
      setTranslatedText(result.translated);
      if (sourceLanguage === 'auto' && result.source_language) {
        setDetectedLanguage(result.source_language);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Translation failed';
      setError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') return;
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopy = async (text: string, setter: (v: boolean) => void) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleSummarizeMeeting = async () => {
    if (!meetingText.trim()) return;

    setIsSummarizing(true);
    setMeetingError(null);

    try {
      const result = await meetingApi.summarize(meetingText, token || undefined);
      setMeetingSummary(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Summarization failed';
      setMeetingError(message);
    } finally {
      setIsSummarizing(false);
    }
  };

  const formatMeetingSummary = (summary: MeetingSummary): string => {
    let text = `## Summary\n${summary.summary}\n\n`;
    if (summary.key_points.length > 0) {
      text += `## Key Points\n${summary.key_points.map(p => `- ${p}`).join('\n')}\n\n`;
    }
    if (summary.action_items.length > 0) {
      text += `## Action Items\n${summary.action_items.map(a => `- [ ] ${a}`).join('\n')}\n\n`;
    }
    if (summary.decisions.length > 0) {
      text += `## Decisions\n${summary.decisions.map(d => `- ${d}`).join('\n')}\n\n`;
    }
    if (summary.participants.length > 0) {
      text += `## Participants\n${summary.participants.join(', ')}`;
    }
    return text;
  };

  const getLanguageName = (code: string) => {
    if (code === 'auto') return 'Auto Detect';
    return languages.find(l => l.code === code)?.name || code;
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (activeMode === 'translate') {
        setInputText(transcript);
      } else {
        setMeetingText(transcript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Translate & Meetings</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Translate text or summarize meeting notes with AI
            </p>
          </div>
        </div>

        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as 'translate' | 'meeting')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="translate">
              <Languages className="w-4 h-4 mr-2" />
              Translate
            </TabsTrigger>
            <TabsTrigger value="meeting">
              <FileText className="w-4 h-4 mr-2" />
              Meeting Notes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-6 pb-6">
        {activeMode === 'translate' ? (
          <div className="space-y-4">
            {/* Language Selectors */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-slate-500">From</Label>
                  <Popover open={sourceOpen} onOpenChange={setSourceOpen}>
                    <PopoverTrigger
                      role="combobox"
                      aria-expanded={sourceOpen}
                      className={cn(buttonVariants({ variant: "outline" }), "w-full mt-1 justify-between font-normal")}
                    >
                      {getLanguageName(sourceLanguage)}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="Auto Detect"
                              onSelect={() => {
                                setSourceLanguage('auto');
                                setSourceOpen(false);
                              }}
                            >
                              <Check className={`mr-2 h-4 w-4 ${sourceLanguage === 'auto' ? 'opacity-100' : 'opacity-0'}`} />
                              Auto Detect
                            </CommandItem>
                            {languages.map(lang => (
                              <CommandItem
                                key={lang.code}
                                value={lang.name}
                                onSelect={() => {
                                  setSourceLanguage(lang.code);
                                  setSourceOpen(false);
                                }}
                              >
                                <Check className={`mr-2 h-4 w-4 ${sourceLanguage === lang.code ? 'opacity-100' : 'opacity-0'}`} />
                                {lang.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {detectedLanguage && (
                    <p className="text-xs text-slate-500 mt-1">Detected: {detectedLanguage}</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapLanguages}
                  disabled={sourceLanguage === 'auto'}
                  className="mt-5"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>

                <div className="flex-1">
                  <Label className="text-xs text-slate-500">To</Label>
                  <Popover open={targetOpen} onOpenChange={setTargetOpen}>
                    <PopoverTrigger
                      role="combobox"
                      aria-expanded={targetOpen}
                      className={cn(buttonVariants({ variant: "outline" }), "w-full mt-1 justify-between font-normal")}
                    >
                      {getLanguageName(targetLanguage)}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map(lang => (
                              <CommandItem
                                key={lang.code}
                                value={lang.name}
                                onSelect={() => {
                                  setTargetLanguage(lang.code);
                                  setTargetOpen(false);
                                }}
                              >
                                <Check className={`mr-2 h-4 w-4 ${targetLanguage === lang.code ? 'opacity-100' : 'opacity-0'}`} />
                                {lang.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>

            {/* Translation Panes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Input */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Original</Label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleListening}
                      className={`rounded-full w-8 h-8 flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <span className="text-xs text-slate-500">
                      {inputText.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>
                <Textarea
                  placeholder="Type or paste text to translate..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </Card>

              {/* Output */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Translation</Label>
                  {translatedText && (
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(translatedText, setCopied)}>
                      {copied ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </div>
                {translatedText ? (
                  <Textarea
                    value={translatedText}
                    readOnly
                    className="min-h-[200px] resize-none bg-slate-50 dark:bg-slate-800/50"
                  />
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400">
                    <div className="text-center">
                      <Languages className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Translation will appear here</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                size="lg"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-4 h-4 mr-2" />
                    Translate
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Meeting Notes Mode */
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Input */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Meeting Notes / Transcript</Label>
                  <button
                    onClick={toggleListening}
                    className={`rounded-full w-8 h-8 flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <Textarea
                  placeholder="Paste meeting transcript or notes here..."
                  value={meetingText}
                  onChange={(e) => setMeetingText(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <Button
                    onClick={handleSummarizeMeeting}
                    disabled={isSummarizing || !meetingText.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isSummarizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Summarize Meeting
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Output */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-semibold">Summary</Label>
                  {meetingSummary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(formatMeetingSummary(meetingSummary), setMeetingCopied)}
                    >
                      {meetingCopied ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                      {meetingCopied ? 'Copied' : 'Copy'}
                    </Button>
                  )}
                </div>

                {meetingError && (
                  <div className="p-3 mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    {meetingError}
                  </div>
                )}

                {meetingSummary ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {meetingSummary.summary}
                      </p>
                    </div>

                    {meetingSummary.key_points.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Points</h4>
                        <ul className="space-y-1">
                          {meetingSummary.key_points.map((point, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                              <span className="text-orange-500 mt-0.5">&#8226;</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {meetingSummary.action_items.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Action Items</h4>
                        <ul className="space-y-1">
                          {meetingSummary.action_items.map((item, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                              <span className="text-green-500">&#9744;</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {meetingSummary.decisions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Decisions</h4>
                        <ul className="space-y-1">
                          {meetingSummary.decisions.map((decision, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                              <span className="text-blue-500">&#10003;</span>
                              {decision}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {meetingSummary.participants.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Participants</h4>
                        <div className="flex flex-wrap gap-1">
                          {meetingSummary.participants.map((p, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400">
                    <div className="text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Meeting summary will appear here</p>
                      <p className="text-xs text-slate-400 mt-1">Key points, action items, decisions</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
