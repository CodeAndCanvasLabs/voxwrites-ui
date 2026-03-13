'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Loader2,
  Check,
  AlertCircle,
  Key,
  Trash2,
  Plus,
  Search,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Power,
  X,
} from 'lucide-react';
import { llmConfigApi, type LLMProvider, type LLMConfig } from '../../lib/api';

interface AISettingsTabProps {
  token: string | null;
  isPro: boolean;
  onNavigate: (page: string) => void;
}

export function AISettingsTab({ token, isPro, onNavigate }: AISettingsTabProps) {
  const [providers, setProviders] = useState<Record<string, LLMProvider>>({});
  const [configs, setConfigs] = useState<LLMConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add/Edit form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formProvider, setFormProvider] = useState('');
  const [formApiKey, setFormApiKey] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [modelSearch, setModelSearch] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isDeletingProvider, setIsDeletingProvider] = useState<string | null>(null);
  const [isTogglingProvider, setIsTogglingProvider] = useState<string | null>(null);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [providerData, configData] = await Promise.all([
        llmConfigApi.getProviders(token),
        llmConfigApi.listConfigs(token),
      ]);
      setProviders(providerData.providers);
      setConfigs(configData.configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load AI settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Get filtered models for selected provider
  const filteredModels = useMemo(() => {
    if (!formProvider || !providers[formProvider]) return [];
    const models = providers[formProvider].models;
    if (!modelSearch) return models;
    const lowerSearch = modelSearch.toLowerCase();
    return models.filter(m =>
      m.id.toLowerCase().includes(lowerSearch) || m.name.toLowerCase().includes(lowerSearch)
    );
  }, [formProvider, providers, modelSearch]);

  // Providers that don't have a config yet
  const availableProviders = useMemo(() => {
    const configuredProviders = new Set(configs.map(c => c.provider));
    return Object.entries(providers)
      .filter(([id]) => !configuredProviders.has(id))
      .map(([id, info]) => ({ id, name: info.name }));
  }, [providers, configs]);

  const resetForm = () => {
    setFormProvider('');
    setFormApiKey('');
    setFormModel('');
    setFormIsActive(true);
    setModelSearch('');
    setShowApiKey(false);
    setValidationResult(null);
    setShowAddForm(false);
  };

  const handleValidateKey = async () => {
    if (!token || !formProvider || !formApiKey) return;
    setIsValidating(true);
    setValidationResult(null);
    try {
      const result = await llmConfigApi.validateKey(formProvider, formApiKey, token);
      setValidationResult(result);
    } catch (err) {
      setValidationResult({ valid: false, message: err instanceof Error ? err.message : 'Validation failed' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!token || !formProvider || !formModel) return;
    if (!formApiKey && !configs.find(c => c.provider === formProvider)) {
      setError('API key is required for new configuration');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const data: { provider: string; selected_model: string; api_key?: string; is_active?: boolean } = {
        provider: formProvider,
        selected_model: formModel,
        is_active: formIsActive,
      };
      if (formApiKey) {
        data.api_key = formApiKey;
      }
      const result = await llmConfigApi.saveConfig(data, token);
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
      resetForm();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (config: LLMConfig) => {
    if (!token) return;
    setIsTogglingProvider(config.provider);
    setError(null);
    try {
      await llmConfigApi.saveConfig(
        { provider: config.provider, selected_model: config.selected_model, is_active: !config.is_active },
        token
      );
      setSuccessMessage(
        !config.is_active
          ? `${config.provider_name} is now active`
          : `${config.provider_name} deactivated`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
    } finally {
      setIsTogglingProvider(null);
    }
  };

  const handleDeleteConfig = async (provider: string) => {
    if (!token) return;
    setIsDeletingProvider(provider);
    try {
      await llmConfigApi.deleteConfig(provider, token);
      setSuccessMessage('Configuration removed');
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete configuration');
    } finally {
      setIsDeletingProvider(null);
    }
  };

  // Free tier - show locked state
  if (!isPro) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">AI Model Configuration</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Upgrade to Pro to configure your own AI providers and models.
            Free tier uses our default models for text enhancement.
          </p>
          <Button
            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
            onClick={() => onNavigate('pricing')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>

          <div className="mt-8 text-left max-w-sm mx-auto">
            <p className="text-sm font-medium mb-3 text-slate-600 dark:text-slate-400">
              Current Default Model
            </p>
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">G</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Google Gemini 2.5 Flash</p>
                  <p className="text-xs text-slate-500">Platform default</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      </Card>
    );
  }

  const activeConfig = configs.find(c => c.is_active);

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}
      {successMessage && (
        <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Security Notice */}
      <Card className="p-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Your API keys are secure</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Keys are encrypted with AES-256 before storage and never sent back to your browser.
              All API calls are made from our server, not your browser.
            </p>
          </div>
        </div>
      </Card>

      {/* Active Provider Banner */}
      {activeConfig && (
        <Card className="p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Active: {activeConfig.provider_name}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Using {activeConfig.selected_model} for text enhancement
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Configured Providers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Configured Providers</h2>
          {availableProviders.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Provider
            </Button>
          )}
        </div>

        {configs.length === 0 ? (
          <div className="text-center py-8">
            <Key className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-slate-500 mb-2">No custom providers configured</p>
            <p className="text-sm text-slate-400 mb-4">
              Using platform defaults. Add your own API key to use custom models.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Provider
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {configs.map((config) => (
              <div
                key={config.id}
                className={`p-4 border rounded-lg transition-colors ${
                  config.is_active
                    ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      config.is_active
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <span className={`text-xs font-bold ${
                        config.is_active
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {config.provider_name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{config.provider_name}</span>
                        {config.is_active ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-400">
                            Inactive
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs gap-1">
                          <Key className="w-3 h-3" />
                          Key set
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{config.selected_model}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(config)}
                      disabled={isTogglingProvider === config.provider}
                      className={`gap-1 ${
                        config.is_active
                          ? 'text-green-600 hover:text-green-700'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={config.is_active ? 'Deactivate' : 'Set as active'}
                    >
                      {isTogglingProvider === config.provider ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Power className="w-4 h-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormProvider(config.provider);
                        setFormModel(config.selected_model);
                        setFormIsActive(config.is_active);
                        setFormApiKey('');
                        setShowAddForm(true);
                      }}
                    >
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove {config.provider_name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete your API key and configuration for {config.provider_name}.
                            You'll revert to platform defaults.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="dark:text-white">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteConfig(config.provider)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeletingProvider === config.provider}
                          >
                            {isDeletingProvider === config.provider ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Remove'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add/Edit Provider Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {configs.find(c => c.provider === formProvider) ? 'Edit Provider' : 'Add Provider'}
          </h3>

          <div className="space-y-4">
            {/* Provider Select */}
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={formProvider}
                onValueChange={(v) => {
                  setFormProvider(v);
                  setFormModel('');
                  setModelSearch('');
                  setValidationResult(null);
                  const existingConfig = configs.find(c => c.provider === v);
                  setFormIsActive(existingConfig ? existingConfig.is_active : true);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(providers).map(([id, info]) => (
                    <SelectItem key={id} value={id}>
                      {info.name}
                      {configs.find(c => c.provider === id) ? ' (configured)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* API Key */}
            {formProvider && (
              <div className="space-y-2">
                <Label>
                  API Key
                  {configs.find(c => c.provider === formProvider) && (
                    <span className="text-xs text-slate-400 ml-2">(leave empty to keep existing)</span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder={`Enter your ${providers[formProvider]?.name} API key`}
                    value={formApiKey}
                    onChange={(e) => {
                      setFormApiKey(e.target.value);
                      setValidationResult(null);
                    }}
                    className="pr-20"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {formApiKey && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleValidateKey}
                    disabled={isValidating}
                    className="gap-1"
                  >
                    {isValidating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Shield className="w-3 h-3" />
                    )}
                    Validate Key
                  </Button>
                )}

                {validationResult && (
                  <p className={`text-xs ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {validationResult.message}
                  </p>
                )}
              </div>
            )}

            {/* Model Selection with Search */}
            {formProvider && providers[formProvider] && (
              <div className="space-y-2">
                <Label>Model</Label>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search models..."
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                  {filteredModels.length === 0 ? (
                    <p className="p-3 text-sm text-slate-400 text-center">No models found</p>
                  ) : (
                    filteredModels.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setFormModel(model.id)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center justify-between ${
                          formModel === model.id ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                        }`}
                      >
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-xs text-slate-400">{model.id}</p>
                        </div>
                        {formModel === model.id && (
                          <Check className="w-4 h-4 text-orange-500 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Active Toggle */}
            {formProvider && (
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Set as active provider</p>
                  <p className="text-xs text-slate-500">
                    {formIsActive
                      ? 'This provider will be used for text enhancement. Other providers will be deactivated.'
                      : 'Save without activating. You can activate it later.'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={formIsActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={formIsActive ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                >
                  <Power className="w-4 h-4 mr-1" />
                  {formIsActive ? 'Active' : 'Inactive'}
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <Separator />
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
                onClick={handleSaveConfig}
                disabled={isSaving || !formProvider || !formModel}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Available Providers Info */}
      {!showAddForm && availableProviders.length > 0 && (
        <Card className="p-4">
          <p className="text-sm text-slate-500 mb-2">Available providers to add:</p>
          <div className="flex flex-wrap gap-2">
            {availableProviders.map((p) => (
              <Badge
                key={p.id}
                variant="outline"
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => {
                  setFormProvider(p.id);
                  setFormIsActive(true);
                  setShowAddForm(true);
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                {p.name}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
