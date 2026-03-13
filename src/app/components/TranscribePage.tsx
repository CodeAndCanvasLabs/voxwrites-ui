'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Upload,
  Copy,
  Check,
  Loader2,
  X,
  FileAudio,
  Sparkles,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { transcribeApi, promptsApi, type AppType, type TranscribeResponse, ApiError } from '../../lib/api';
import { AppTypeIcon } from '../../lib/icon-map';

interface TranscribePageProps {
  token: string | null;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = [
  'audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4',
  'audio/ogg', 'audio/flac', 'audio/mp3', 'audio/x-wav',
  'audio/x-m4a', 'audio/aac',
];
const ALLOWED_EXTENSIONS = ['.webm', '.wav', '.mp3', '.m4a', '.ogg', '.flac', '.aac'];

const LANGUAGES = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'fa', name: 'Persian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'tl', name: 'Filipino' },
  { code: 'ca', name: 'Catalan' },
  { code: 'sr', name: 'Serbian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'et', name: 'Estonian' },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function TranscribePage({ token }: TranscribePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Settings
  const [language, setLanguage] = useState('auto');
  const [appType, setAppType] = useState('other');
  const [enhance, setEnhance] = useState(false);
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [appTypes, setAppTypes] = useState<AppType[]>([]);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState<'uploading' | 'transcribing' | 'enhancing'>('uploading');

  // Results
  const [result, setResult] = useState<TranscribeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedEnhanced, setCopiedEnhanced] = useState(false);
  const [showSegments, setShowSegments] = useState(false);

  // Load app types on mount
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await promptsApi.getAppTypes();
        setAppTypes(types);
      } catch {
        // Non-critical
      }
    };
    loadTypes();
  }, []);

  const validateFile = useCallback((f: File): string | null => {
    if (f.size > MAX_FILE_SIZE) {
      return `File too large (${formatFileSize(f.size)}). Maximum is 25MB.`;
    }
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    const typeOk = ALLOWED_TYPES.includes(f.type);
    const extOk = ALLOWED_EXTENSIONS.includes(ext);
    if (!typeOk && !extOk) {
      return 'Unsupported file format. Supported: MP3, WAV, M4A, OGG, FLAC, WebM';
    }
    return null;
  }, []);

  const handleFileSelect = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  }, [validateFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleTranscribe = async () => {
    if (!file || !token) return;

    setIsUploading(true);
    setError(null);
    setResult(null);
    setUploadProgress(0);
    setProcessingPhase('uploading');

    try {
      const response = await transcribeApi.transcribe(
        file,
        {
          language: language === 'auto' ? undefined : language,
          save_to_history: saveToHistory,
          enhance,
          app_type: appType,
        },
        token,
        (percent) => {
          setUploadProgress(percent);
          if (percent >= 100) {
            setProcessingPhase(enhance ? 'transcribing' : 'transcribing');
          }
        }
      );
      if (enhance && response.enhanced_text) {
        setProcessingPhase('enhancing');
      }
      setResult(response);
      setFile(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Transcription failed. Please try again.';
      setError(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCopy = async (text: string, type: 'original' | 'enhanced') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'original') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedEnhanced(true);
        setTimeout(() => setCopiedEnhanced(false), 2000);
      }
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4 border-b border-slate-200 dark:border-slate-700/50">
        <div>
          <h2 className="text-2xl font-bold">Transcribe</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload an audio file to transcribe it with AI
          </p>
        </div>

        {/* Settings Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-[#1a1d2e]">
              <Globe className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* App Type */}
          <Select value={appType} onValueChange={setAppType}>
            <SelectTrigger className="w-[150px] bg-white dark:bg-[#1a1d2e]">
              <SelectValue placeholder="Context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="other">General</SelectItem>
              {appTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <AppTypeIcon iconName={type.icon} className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Enhance Toggle */}
          <Button
            variant={enhance ? 'default' : 'outline'}
            size="sm"
            onClick={() => setEnhance(!enhance)}
            className={enhance ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Enhance
          </Button>

          {/* Save Toggle */}
          <Button
            variant={saveToHistory ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSaveToHistory(!saveToHistory)}
            className={saveToHistory ? 'bg-slate-700 hover:bg-slate-800 text-white dark:bg-slate-600' : ''}
          >
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column — Upload */}
        <div className="space-y-4">
          <Card className="p-6">
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                    : 'border-slate-300 dark:border-slate-600 hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                    e.target.value = '';
                  }}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                    isDragging
                      ? 'bg-orange-100 dark:bg-orange-900/30'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-orange-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {isDragging ? 'Drop your audio file here' : 'Drag & drop audio file here'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      or <span className="text-orange-600 hover:text-orange-700">click to browse</span>
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    MP3, WAV, M4A, OGG, FLAC, WebM — max 25MB
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setFile(null); setError(null); }}
                    disabled={isUploading}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Progress */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Progress
                        value={uploadProgress}
                        className="h-2 [&>[data-slot=progress-indicator]]:bg-orange-500"
                      />
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        {processingPhase === 'uploading' && `Uploading... ${uploadProgress}%`}
                        {processingPhase === 'transcribing' && 'Transcribing with Whisper AI...'}
                        {processingPhase === 'enhancing' && 'Enhancing text with AI...'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Transcribe Button */}
                <Button
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
                  size="lg"
                  onClick={handleTranscribe}
                  disabled={isUploading || !token}
                >
                  {isUploading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                  ) : (
                    <><FileAudio className="w-4 h-4 mr-2" />Transcribe</>
                  )}
                </Button>
              </motion.div>
            )}
          </Card>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Card */}
          {!file && !result && (
            <Card className="p-4 bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50">
              <h4 className="font-medium text-sm mb-2">How it works</h4>
              <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside">
                <li>Upload an audio file (recording, meeting, voice memo)</li>
                <li>Select language or let AI auto-detect it</li>
                <li>Get accurate transcription powered by OpenAI Whisper</li>
                <li>Optionally enhance the text with AI to fix grammar & filler words</li>
              </ol>
            </Card>
          )}
        </div>

        {/* Right Column — Results */}
        <div className="space-y-4">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Transcription Result */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Transcription</h3>
                  <div className="flex items-center gap-2">
                    {result.duration && (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(result.duration)}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {result.word_count} words
                    </Badge>
                    {result.language && result.language !== 'unknown' && (
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        {LANGUAGES.find(l => l.code === result.language)?.name || result.language}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(result.text, 'original')}
                      className="h-7 px-2"
                    >
                      {copied ? (
                        <><Check className="w-3 h-3 mr-1 text-green-500" />Copied</>
                      ) : (
                        <><Copy className="w-3 h-3 mr-1" />Copy</>
                      )}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={result.text}
                  readOnly
                  className="min-h-[200px] resize-none bg-slate-50 dark:bg-slate-800/30"
                />
                {result.saved && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved to history
                  </p>
                )}
              </Card>

              {/* Enhanced Text */}
              {result.enhanced_text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card className="p-5 border-orange-200 dark:border-orange-800/50 bg-orange-50/30 dark:bg-orange-900/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Enhanced</h3>
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(result.enhanced_text!, 'enhanced')}
                        className="h-7 px-2"
                      >
                        {copiedEnhanced ? (
                          <><Check className="w-3 h-3 mr-1 text-green-500" />Copied</>
                        ) : (
                          <><Copy className="w-3 h-3 mr-1" />Copy</>
                        )}
                      </Button>
                    </div>
                    <Textarea
                      value={result.enhanced_text}
                      readOnly
                      className="min-h-[200px] resize-none bg-white/50 dark:bg-slate-800/30"
                    />
                  </Card>
                </motion.div>
              )}

              {/* Segments */}
              {result.segments && result.segments.length > 0 && (
                <Card className="p-4">
                  <button
                    onClick={() => setShowSegments(!showSegments)}
                    className="w-full flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <span>Timestamps ({result.segments.length} segments)</span>
                    {showSegments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {showSegments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-1 max-h-[300px] overflow-y-auto"
                      >
                        {result.segments.map((seg, i) => (
                          <div
                            key={i}
                            className="flex gap-3 py-1.5 text-sm border-b border-slate-100 dark:border-slate-800 last:border-0"
                          >
                            <span className="text-xs text-slate-400 font-mono w-20 flex-shrink-0">
                              {formatDuration(seg.start)} - {formatDuration(seg.end)}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{seg.text}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              {/* Transcribe Another */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  setError(null);
                }}
              >
                Transcribe Another File
              </Button>
            </motion.div>
          ) : (
            <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <FileAudio className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-medium text-slate-600 dark:text-slate-400 mb-1">
                No transcription yet
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Upload an audio file to see the transcription results here
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
