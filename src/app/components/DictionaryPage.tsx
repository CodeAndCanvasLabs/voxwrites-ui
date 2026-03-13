'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Save,
  BookOpen,
  Hash,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  dictionaryApi,
  type DictionaryEntry,
  type CreateDictionaryEntryRequest,
} from '../../lib/api';

interface DictionaryPageProps {
  token: string | null;
}

type DictionaryCategory = 'name' | 'technical' | 'medical' | 'legal' | 'custom';

const CATEGORY_LABELS: Record<DictionaryCategory, string> = {
  name: 'Name',
  technical: 'Technical',
  medical: 'Medical',
  legal: 'Legal',
  custom: 'Custom',
};

const CATEGORY_COLORS: Record<DictionaryCategory, string> = {
  name: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  technical: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  medical: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  legal: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  custom: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

interface FormData {
  word: string;
  phonetic_hints: string;
  category: DictionaryCategory;
  case_sensitive: boolean;
  description: string;
}

const EMPTY_FORM: FormData = {
  word: '',
  phonetic_hints: '',
  category: 'custom',
  case_sensitive: false,
  description: '',
};

export function DictionaryPage({ token }: DictionaryPageProps) {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DictionaryEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const category = filterCategory === 'all' ? undefined : filterCategory;
      const search = searchQuery.trim() || undefined;
      const result = await dictionaryApi.list(token, category, search);
      setEntries(result.entries);
    } catch (error) {
      // Failed to load dictionary entries
    } finally {
      setIsLoading(false);
    }
  }, [token, filterCategory, searchQuery]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const openCreateDialog = () => {
    setEditingEntry(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setFormData({
      word: entry.word,
      phonetic_hints: entry.phonetic_hints.join(', '),
      category: entry.category as DictionaryCategory,
      case_sensitive: entry.case_sensitive,
      description: entry.description || '',
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!token) return;

    if (!formData.word.trim()) {
      setFormError('Word is required');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const hints = formData.phonetic_hints
        .split(',')
        .map(h => h.trim())
        .filter(Boolean);

      if (editingEntry) {
        const updated = await dictionaryApi.update(token, editingEntry.id, {
          word: formData.word.trim(),
          phonetic_hints: hints,
          category: formData.category,
          case_sensitive: formData.case_sensitive,
          description: formData.description.trim() || undefined,
        });
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? updated : e));
      } else {
        const request: CreateDictionaryEntryRequest = {
          word: formData.word.trim(),
          phonetic_hints: hints,
          category: formData.category,
          case_sensitive: formData.case_sensitive,
          description: formData.description.trim() || undefined,
        };
        const created = await dictionaryApi.create(token, request);
        setEntries(prev => [...prev, created]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save entry';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;

    setIsDeleting(true);
    try {
      await dictionaryApi.delete(token, deleteTarget.id);
      setEntries(prev => prev.filter(e => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      // Failed to delete
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Personal Dictionary</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {entries.length} {entries.length === 1 ? 'word' : 'words'} &mdash; teach VoxWrites your vocabulary
            </p>
          </div>
          <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Word
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search words or hints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="name">Names</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Entries List */}
      <div className="px-6 pb-6 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <Card className="p-12 text-center items-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery || filterCategory !== 'all' ? 'No matches found' : 'No words yet'}
            </h3>
            <p className="text-slate-500 mb-4">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Add words that speech recognition often gets wrong. Include phonetic hints so VoxWrites auto-corrects them.'}
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Word
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-lg truncate">{entry.word}</p>
                        <Badge className={`text-xs mt-1 ${CATEGORY_COLORS[entry.category as DictionaryCategory] || CATEGORY_COLORS.custom}`}>
                          {CATEGORY_LABELS[entry.category as DictionaryCategory] || entry.category}
                        </Badge>
                      </div>
                      {entry.case_sensitive && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">Aa</Badge>
                      )}
                    </div>

                    {entry.phonetic_hints.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-slate-500 mb-1">Misheard as:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.phonetic_hints.map((hint, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {hint}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 flex-1">
                        {entry.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {entry.usage_count} corrections
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(entry)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              {editingEntry ? 'Edit Word' : 'Add Word'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {formError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                {formError}
              </div>
            )}

            <div>
              <Label htmlFor="word">Correct Word / Term</Label>
              <Input
                id="word"
                placeholder='e.g. "Kubernetes" or "Dr. Smith"'
                value={formData.word}
                onChange={(e) => setFormData(prev => ({ ...prev, word: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="hints">Phonetic Hints (comma-separated)</Label>
              <Input
                id="hints"
                placeholder='e.g. "kuber netties, kuber net ease, cube ernets"'
                value={formData.phonetic_hints}
                onChange={(e) => setFormData(prev => ({ ...prev, phonetic_hints: e.target.value }))}
                className="mt-1.5"
              />
              <p className="text-xs text-slate-500 mt-1">
                Common misrecognitions that should be auto-corrected to this word
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as DictionaryCategory }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id="case-sensitive"
                    checked={formData.case_sensitive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, case_sensitive: checked }))}
                  />
                  <Label htmlFor="case-sensitive" className="text-sm">Case Sensitive</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="e.g. Container orchestration platform"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.word.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingEntry ? 'Save Changes' : 'Add Word'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Word</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove &ldquo;{deleteTarget?.word}&rdquo; from your personal dictionary? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="dark:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
