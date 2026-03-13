'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Save,
  X,
  Loader2,
  Check,
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
import { promptsApi, type Prompt, type AppType } from '../../lib/api';
import { AppTypeIcon } from '../../lib/icon-map';

interface PromptsPageProps {
  token: string | null;
}

export function PromptsPage({ token }: PromptsPageProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [appTypes, setAppTypes] = useState<AppType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppType, setSelectedAppType] = useState<string>('all');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editedText, setEditedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load prompts and app types
  useEffect(() => {
    const loadData = async () => {
      try {
        const [promptsData, typesData] = await Promise.all([
          promptsApi.list(token || undefined),
          promptsApi.getAppTypes(),
        ]);
        setPrompts(promptsData);
        setAppTypes(typesData);
      } catch (error) {
        console.error('Failed to load prompts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setEditedText(prompt.prompt);
    setIsDialogOpen(true);
  };

  const handleSavePrompt = async () => {
    if (!editingPrompt || !token) return;

    setIsSaving(true);
    try {
      const updatedPrompt = await promptsApi.saveOverride(
        editingPrompt.app_type,
        editedText,
        token
      );
      setPrompts((prev) =>
        prev.map((p) =>
          p.app_type === editingPrompt.app_type ? updatedPrompt : p
        )
      );
      setIsDialogOpen(false);
      setEditingPrompt(null);
    } catch (error) {
      console.error('Failed to save prompt:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPrompt = async (prompt: Prompt) => {
    if (!token) return;

    try {
      await promptsApi.resetToDefault(prompt.app_type, token);
      // Reload prompts to get the default
      const promptsData = await promptsApi.list(token);
      setPrompts(promptsData);
    } catch (error) {
      console.error('Failed to reset prompt:', error);
    }
  };

  const filteredPrompts =
    selectedAppType === 'all'
      ? prompts
      : prompts.filter((p) => p.app_type === selectedAppType);

  const getAppTypeInfo = (appType: string) => {
    return appTypes.find((t) => t.value === appType);
  };

  return (
    <div>
      {/* Sticky Header + Filter */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Prompts</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Customize AI prompts for different app types
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select value={selectedAppType} onValueChange={setSelectedAppType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by app type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All App Types</SelectItem>
                {appTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="inline-flex items-center gap-1.5"><AppTypeIcon name={type.icon} size={14} /> {type.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="px-6 pb-6">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="flex-1">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded mt-1" />
                  </div>
                </div>
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredPrompts.map((prompt, index) => {
            const appTypeInfo = getAppTypeInfo(prompt.app_type);
            return (
              <motion.div
                key={prompt.id || prompt.app_type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl">
                        <AppTypeIcon name={appTypeInfo?.icon || 'file-text'} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {appTypeInfo?.label || prompt.app_type}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {appTypeInfo?.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {prompt.is_default ? (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-orange-500 text-white">Custom</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 mb-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                      {prompt.prompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditPrompt(prompt)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!prompt.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetPrompt(prompt)}
                        className="text-slate-500 hover:text-red-500"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No prompts found</h3>
          <p className="text-slate-600 dark:text-slate-400">
            No prompts match the selected filter.
          </p>
        </div>
      )}
      </>
      )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl" expandable>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              Edit Prompt - {getAppTypeInfo(editingPrompt?.app_type || '')?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Prompt Template
              </label>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="min-h-[250px] max-h-[50vh] resize-y font-mono text-sm"
                placeholder="Enter your custom prompt..."
              />
              <p className="text-xs text-slate-500 mt-2">
                This prompt will be used when enhancing text for{' '}
                {getAppTypeInfo(editingPrompt?.app_type || '')?.label} apps.
              </p>
            </div>
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
              onClick={handleSavePrompt}
              disabled={isSaving || !editedText.trim()}
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
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
