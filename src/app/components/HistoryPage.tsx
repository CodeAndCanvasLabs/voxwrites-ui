'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  FileText,
  Search,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Calendar,
  Download,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { transcriptionsApi, promptsApi, exportApi, type Transcription, type AppType } from '../../lib/api';
import { AppTypeIcon } from '../../lib/icon-map';

interface HistoryPageProps {
  token: string | null;
}

export function HistoryPage({ token }: HistoryPageProps) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [appTypes, setAppTypes] = useState<AppType[]>([]);
  const [filterAppType, setFilterAppType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedEnhanced, setExpandedEnhanced] = useState<Set<string>>(new Set());
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const toggleEnhanced = (id: string) => {
    setExpandedEnhanced(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Load app types
  useEffect(() => {
    const loadAppTypes = async () => {
      try {
        const types = await promptsApi.getAppTypes();
        setAppTypes(types);
      } catch (error) {
        console.error('Failed to load app types:', error);
      }
    };
    loadAppTypes();
  }, []);

  // Load transcriptions
  useEffect(() => {
    const loadTranscriptions = async () => {
      if (!token) return;

      setIsLoading(true);
      try {
        const appTypeFilter = filterAppType === 'all' ? undefined : filterAppType;
        const result = await transcriptionsApi.list(token, page, pageSize, appTypeFilter);
        setTranscriptions(result.items);
        setTotal(result.total);
        setTotalPages(Math.ceil(result.total / pageSize));
      } catch (error) {
        console.error('Failed to load transcriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranscriptions();
  }, [token, page, pageSize, filterAppType]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;

    setDeletingId(id);
    try {
      await transcriptionsApi.delete(token, id);
      setTranscriptions(prev => prev.filter(t => t.id !== id));
      setTotal(prev => prev - 1);
    } catch (error) {
      console.error('Failed to delete transcription:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAppLabel = (appType: string) => {
    const type = appTypes.find(t => t.value === appType);
    return type?.label || appType;
  };

  const getAppIconName = (appType: string) => {
    const type = appTypes.find(t => t.value === appType);
    return type?.icon || 'file-text';
  };

  // Filter transcriptions by search query (client-side)
  const filteredTranscriptions = searchQuery
    ? transcriptions.filter(t =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.app_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcriptions;

  return (
    <div>
      {/* Sticky Header + Filters */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Transcription History</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {total} total transcriptions
            </p>
          </div>
          <div className="flex gap-2">
            {(['csv', 'markdown', 'pdf', 'docx'] as const).map(format => (
              <Button
                key={format}
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!token) return;
                  setExportingFormat(format);
                  try {
                    const appFilter = filterAppType !== 'all' ? filterAppType : undefined;
                    await exportApi.download(token, format, appFilter);
                  } catch (err) {
                    console.error(`Export ${format} failed:`, err);
                  } finally {
                    setExportingFormat(null);
                  }
                }}
                disabled={!token || exportingFormat === format}
              >
                {exportingFormat === format ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <Download className="w-3 h-3 mr-1" />
                )}
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search transcriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterAppType} onValueChange={(value) => {
                setFilterAppType(value);
                setPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Apps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Apps</SelectItem>
                  {appTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="inline-flex items-center gap-1.5"><AppTypeIcon name={type.icon} size={14} /> {type.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Transcription List */}
      <div className="px-6 pb-6 space-y-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="flex items-center justify-between">
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredTranscriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium mb-2">No transcriptions found</h3>
            <p className="text-slate-500">
              {searchQuery || filterAppType !== 'all'
                ? 'Try adjusting your filters'
                : 'Start recording to see your transcription history'}
            </p>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredTranscriptions.map((transcription, index) => (
              <motion.div
                key={transcription.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    {/* Text content — collapsible if long */}
                    {(() => {
                      const isLong = transcription.text.length > 200;
                      const isExpanded = expandedItems.has(transcription.id);
                      return (
                        <div>
                          <p className={`text-sm leading-relaxed ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>
                            {transcription.text}
                          </p>
                          {isLong && (
                            <button
                              onClick={() => toggleExpanded(transcription.id)}
                              className="text-xs text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 mt-1 font-medium"
                            >
                              {isExpanded ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </div>
                      );
                    })()}

                    {/* AI Enhanced — collapsed by default, click to expand */}
                    {transcription.enhanced_text && (
                      <div>
                        <button
                          onClick={() => toggleEnhanced(transcription.id)}
                          className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-medium hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI Enhanced
                          <ChevronDown className={`w-3 h-3 transition-transform ${expandedEnhanced.has(transcription.id) ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedEnhanced.has(transcription.id) && (
                          <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm flex-1">{transcription.enhanced_text}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(transcription.enhanced_text!, transcription.id + '-enhanced')}
                                className="h-7 w-7 p-0 shrink-0"
                              >
                                {copiedId === transcription.id + '-enhanced' ? (
                                  <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-orange-500" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Metadata row */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <span className="inline-flex items-center gap-1"><AppTypeIcon name={getAppIconName(transcription.app_type)} size={12} /> {transcription.app_name || getAppLabel(transcription.app_type)}</span>
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {transcription.word_count} words
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(transcription.created_at)}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(transcription.enhanced_text || transcription.text, transcription.id)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedId === transcription.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transcription.id)}
                          disabled={deletingId === transcription.id}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
                        >
                          {deletingId === transcription.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3">
            <p className="text-sm text-slate-500">
              Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400 px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
