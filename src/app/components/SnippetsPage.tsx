'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Save,
  X,
  Zap,
  FileText,
  Globe,
  Terminal,
  Hash,
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
  snippetsApi,
  type Snippet,
  type SnippetCategory,
  type SnippetActionType,
  type CreateSnippetRequest,
  type UpdateSnippetRequest,
} from '../../lib/api';

interface SnippetsPageProps {
  token: string | null;
}

const ACTION_TYPE_LABELS: Record<SnippetActionType, { label: string; icon: typeof FileText }> = {
  insert_text: { label: 'Insert Text', icon: FileText },
  run_ai_command: { label: 'AI Command', icon: Zap },
  open_url: { label: 'Open URL', icon: Globe },
};

const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  snippet: 'Snippet',
  command: 'Command',
};

interface SnippetFormData {
  trigger_phrase: string;
  content: string;
  category: SnippetCategory;
  action_type: SnippetActionType;
  is_active: boolean;
}

const EMPTY_FORM: SnippetFormData = {
  trigger_phrase: '',
  content: '',
  category: 'snippet',
  action_type: 'insert_text',
  is_active: true,
};

export function SnippetsPage({ token }: SnippetsPageProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [formData, setFormData] = useState<SnippetFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toggle loading (per-snippet)
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Snippet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSnippets = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const categoryFilter = filterCategory === 'all' ? undefined : filterCategory as SnippetCategory;
      const result = await snippetsApi.list(token, categoryFilter);
      setSnippets(result.snippets);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, filterCategory]);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  const openCreateDialog = () => {
    setEditingSnippet(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setFormData({
      trigger_phrase: snippet.trigger_phrase,
      content: snippet.content,
      category: snippet.category as SnippetCategory,
      action_type: snippet.action_type as SnippetActionType,
      is_active: snippet.is_active,
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!token) return;

    if (!formData.trigger_phrase.trim() || formData.trigger_phrase.trim().length < 2) {
      setFormError('Trigger phrase must be at least 2 characters');
      return;
    }
    if (!formData.content.trim()) {
      setFormError('Content is required');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      if (editingSnippet) {
        const request: UpdateSnippetRequest = {
          trigger_phrase: formData.trigger_phrase.trim(),
          content: formData.content.trim(),
          category: formData.category,
          action_type: formData.action_type,
          is_active: formData.is_active,
        };
        const updated = await snippetsApi.update(token, editingSnippet.id, request);
        setSnippets(prev => prev.map(s => s.id === editingSnippet.id ? updated : s));
      } else {
        const request: CreateSnippetRequest = {
          trigger_phrase: formData.trigger_phrase.trim(),
          content: formData.content.trim(),
          category: formData.category,
          action_type: formData.action_type,
        };
        const created = await snippetsApi.create(token, request);
        setSnippets(prev => [...prev, created]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save snippet';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;

    setIsDeleting(true);
    try {
      await snippetsApi.delete(token, deleteTarget.id);
      setSnippets(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (snippet: Snippet) => {
    if (!token || togglingId) return;

    setTogglingId(snippet.id);
    try {
      const updated = await snippetsApi.update(token, snippet.id, {
        is_active: !snippet.is_active,
      });
      setSnippets(prev => prev.map(s => s.id === snippet.id ? updated : s));
    } catch {
      // Failed to toggle snippet
    } finally {
      setTogglingId(null);
    }
  };

  const filteredSnippets = searchQuery
    ? snippets.filter(s =>
        s.trigger_phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : snippets;

  const getContentLabel = (snippet: Snippet) => {
    if (snippet.action_type === 'open_url') return 'URL';
    if (snippet.action_type === 'run_ai_command') return 'AI Instruction';
    return 'Text Content';
  };

  return (
    <div>
      {/* Sticky Header + Filters */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Snippets & Commands</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'} total
            </p>
          </div>
          <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Snippet
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by trigger or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="snippet">Snippets</SelectItem>
                  <SelectItem value="command">Commands</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Snippets List */}
      <div className="px-6 pb-6 space-y-4">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mt-1" />
                  </div>
                </div>
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredSnippets.map((snippet, index) => {
            const ActionIcon = ACTION_TYPE_LABELS[snippet.action_type as SnippetActionType]?.icon || FileText;
            return (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`p-5 h-full flex flex-col ${!snippet.is_active ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <ActionIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-semibold truncate">
                            {snippet.trigger_phrase}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge
                            variant={snippet.category === 'command' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {CATEGORY_LABELS[snippet.category as SnippetCategory] || snippet.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ACTION_TYPE_LABELS[snippet.action_type as SnippetActionType]?.label || snippet.action_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {togglingId === snippet.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-orange-500 flex-shrink-0" />
                    ) : (
                      <Switch
                        checked={snippet.is_active}
                        onCheckedChange={() => handleToggleActive(snippet)}
                        className="flex-shrink-0"
                      />
                    )}
                  </div>

                  <div className="flex-1 mb-4">
                    <p className="text-xs text-slate-500 mb-1">{getContentLabel(snippet)}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {snippet.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {snippet.usage_count} uses
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(snippet)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(snippet)}
                        className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSnippets.length === 0 && !isLoading && (
        <Card className="p-12 text-center items-center">
          <Terminal className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <h3 className="text-lg font-medium mb-2">
            {searchQuery || filterCategory !== 'all' ? 'No matches found' : 'No snippets yet'}
          </h3>
          <p className="text-slate-500 mb-4">
            {searchQuery || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create voice-activated snippets to quickly insert text or run commands'}
          </p>
          {!searchQuery && filterCategory === 'all' && (
            <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Snippet
            </Button>
          )}
        </Card>
      )}
      </>
      )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl" expandable>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-orange-500" />
              {editingSnippet ? 'Edit Snippet' : 'New Snippet'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            {formError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                {formError}
              </div>
            )}

            <div>
              <Label htmlFor="trigger">Trigger Phrase</Label>
              <Input
                id="trigger"
                placeholder='e.g. "my address" or "sign off"'
                value={formData.trigger_phrase}
                onChange={(e) => setFormData(prev => ({ ...prev, trigger_phrase: e.target.value }))}
                className="mt-1.5"
              />
              <p className="text-xs text-slate-500 mt-1">
                Say this phrase to activate the snippet
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({
                    ...prev,
                    category: v as SnippetCategory,
                    action_type: v === 'snippet' ? 'insert_text' : prev.action_type,
                  }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="snippet">Snippet</SelectItem>
                    <SelectItem value="command">Command</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Action Type</Label>
                <Select
                  value={formData.action_type}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, action_type: v as SnippetActionType }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert_text">Insert Text</SelectItem>
                    <SelectItem value="run_ai_command">AI Command</SelectItem>
                    <SelectItem value="open_url">Open URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content">
                {formData.action_type === 'open_url'
                  ? 'URL'
                  : formData.action_type === 'run_ai_command'
                    ? 'AI Instruction'
                    : 'Text Content'}
              </Label>
              <Textarea
                id="content"
                placeholder={
                  formData.action_type === 'open_url'
                    ? 'https://example.com'
                    : formData.action_type === 'run_ai_command'
                      ? 'e.g. "Translate the selected text to Spanish"'
                      : 'The text that will be inserted when triggered'
                }
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="mt-1.5 min-h-[120px] max-h-[35vh] resize-y"
              />
            </div>

            {editingSnippet && (
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.trigger_phrase.trim() || !formData.content.trim()}
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
                  {editingSnippet ? 'Save Changes' : 'Create Snippet'}
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
            <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the snippet triggered by "{deleteTarget?.trigger_phrase}"? This action cannot be undone.
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
