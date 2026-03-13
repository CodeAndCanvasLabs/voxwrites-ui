'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Save,
  Paintbrush,
  Copy,
  Check,
  Hash,
  Sparkles,
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
  stylesApi,
  type Style,
  type CreateStyleRequest,
} from '../../lib/api';

interface StylesPageProps {
  token: string | null;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  template: string;
  tone: string;
  instructions: string;
  icon: string;
}

const EMPTY_FORM: FormData = {
  name: '',
  description: '',
  category: 'general',
  template: '{{text}}',
  tone: '',
  instructions: '',
  icon: '',
};

const CATEGORIES = ['email', 'social', 'code', 'writing', 'business', 'general'];

export function StylesPage({ token }: StylesPageProps) {
  const [styles, setStyles] = useState<Style[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Style | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Apply style state
  const [applyingStyleId, setApplyingStyleId] = useState<string | null>(null);
  const [applyText, setApplyText] = useState('');
  const [applyResult, setApplyResult] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const loadStyles = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const result = await stylesApi.list(token);
      setStyles(result.styles);
    } catch (error) {
      // Failed to load styles
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadStyles();
  }, [loadStyles]);

  const openCreateDialog = () => {
    setEditingStyle(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (style: Style) => {
    if (style.is_default) return;
    setEditingStyle(style);
    setFormData({
      name: style.name,
      description: style.description || '',
      category: style.category || 'general',
      template: style.template,
      tone: style.tone || '',
      instructions: style.instructions || '',
      icon: style.icon || '',
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!token) return;

    if (!formData.name.trim()) {
      setFormError('Style name is required');
      return;
    }
    if (!formData.template.trim()) {
      setFormError('Template is required');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const request: CreateStyleRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        template: formData.template,
        tone: formData.tone.trim() || undefined,
        instructions: formData.instructions.trim() || undefined,
        icon: formData.icon.trim() || undefined,
      };

      if (editingStyle) {
        const updated = await stylesApi.update(token, editingStyle.id, request);
        setStyles(prev => prev.map(s => s.id === editingStyle.id ? updated : s));
      } else {
        const created = await stylesApi.create(token, request);
        setStyles(prev => [...prev, created]);
      }
      setIsDialogOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save style';
      setFormError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;

    setIsDeleting(true);
    try {
      await stylesApi.delete(token, deleteTarget.id);
      setStyles(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      // Failed to delete
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApply = async () => {
    if (!token || !applyingStyleId || !applyText.trim()) return;

    setIsApplying(true);
    try {
      const result = await stylesApi.apply(token, applyingStyleId, applyText);
      setApplyResult(result.styled);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to apply style';
      setApplyResult(`Error: ${message}`);
    } finally {
      setIsApplying(false);
    }
  };

  const handleCopyResult = async () => {
    if (!applyResult) return;
    await navigator.clipboard.writeText(applyResult);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const builtInStyles = styles.filter(s => s.is_default);
  const customStyles = styles.filter(s => !s.is_default);

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Styles & Presets</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Quick-apply formatting templates to your text
            </p>
          </div>
          <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Style
          </Button>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Built-in Styles */}
            {builtInStyles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Built-in Styles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {builtInStyles.map((style, index) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="p-5 h-full flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {style.icon && <span className="text-xl">{style.icon}</span>}
                            <h4 className="font-semibold">{style.name}</h4>
                          </div>
                          <Badge variant="outline" className="text-xs">Built-in</Badge>
                        </div>
                        {style.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex-1">
                            {style.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                          <Badge variant="secondary" className="text-xs">{style.category}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setApplyingStyleId(style.id);
                              setApplyText('');
                              setApplyResult('');
                            }}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Try It
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Styles */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Your Styles
                <span className="text-sm font-normal text-slate-500 ml-2">
                  ({customStyles.length})
                </span>
              </h3>
              {customStyles.length === 0 ? (
                <Card className="p-12 text-center items-center">
                  <Paintbrush className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                  <h3 className="text-lg font-medium mb-2">No custom styles yet</h3>
                  <p className="text-slate-500 mb-4">
                    Create reusable text templates for emails, social posts, commit messages, and more.
                  </p>
                  <Button onClick={openCreateDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Style
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {customStyles.map((style, index) => (
                      <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Card className="p-5 h-full flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {style.icon && <span className="text-xl">{style.icon}</span>}
                              <h4 className="font-semibold">{style.name}</h4>
                            </div>
                          </div>
                          {style.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex-1">
                              {style.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {style.usage_count} uses
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setApplyingStyleId(style.id);
                                  setApplyText('');
                                  setApplyResult('');
                                }}
                                className="h-8"
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Try
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(style)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(style)}
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
          </>
        )}
      </div>

      {/* Apply Style Dialog */}
      <Dialog open={!!applyingStyleId} onOpenChange={(open) => !open && setApplyingStyleId(null)}>
        <DialogContent className="sm:max-w-2xl" expandable>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Apply Style
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <Label>Your Text</Label>
              <Textarea
                placeholder="Paste or type text to style..."
                value={applyText}
                onChange={(e) => setApplyText(e.target.value)}
                className="mt-1.5 min-h-[140px] max-h-[40vh] resize-y"
              />
            </div>
            {applyResult && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Result</Label>
                  <Button variant="ghost" size="sm" onClick={handleCopyResult}>
                    {copiedResult ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedResult ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <Textarea
                  value={applyResult}
                  readOnly
                  className="min-h-[140px] max-h-[40vh] resize-y bg-slate-50 dark:bg-slate-800"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyingStyleId(null)}>
              Close
            </Button>
            <Button
              onClick={handleApply}
              disabled={isApplying || !applyText.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply Style
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl" expandable>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-orange-500" />
              {editingStyle ? 'Edit Style' : 'New Style'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            {formError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="style-name">Name</Label>
                <Input
                  id="style-name"
                  placeholder='e.g. "Friendly Reply"'
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="style-icon">Icon</Label>
                <Input
                  id="style-icon"
                  placeholder="e.g. emoji"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="style-desc">Description</Label>
              <Input
                id="style-desc"
                placeholder="What does this style do?"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="style-tone">Tone</Label>
                <Input
                  id="style-tone"
                  placeholder="e.g. casual, formal"
                  value={formData.tone}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="style-template">Template</Label>
              <Textarea
                id="style-template"
                placeholder={'Use {{text}} where input text goes.\ne.g. "Subject: {{text}}\\n\\nBest regards,"'}
                value={formData.template}
                onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                className="mt-1.5 min-h-[100px] max-h-[30vh] resize-y font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                {'Use {{text}} as placeholder for input text'}
              </p>
            </div>

            <div>
              <Label htmlFor="style-instructions">AI Instructions (optional)</Label>
              <Textarea
                id="style-instructions"
                placeholder="e.g. Keep it under 280 characters. Use hashtags."
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                className="mt-1.5 min-h-[80px] max-h-[25vh] resize-y"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.name.trim() || !formData.template.trim()}
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
                  {editingStyle ? 'Save Changes' : 'Create Style'}
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
            <AlertDialogTitle>Delete Style</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This cannot be undone.
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
