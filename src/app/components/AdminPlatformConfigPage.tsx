'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
  Check,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  Shield,
  Settings2,
  X,
} from 'lucide-react';
import {
  platformConfigApi,
  llmConfigApi,
  fetchPublicKey,
  type PlatformConfig,
  type LLMProvider,
  type TierModelConfig,
} from '../../lib/api';
import { encryptWithPublicKey } from '../../lib/crypto';

interface AdminPlatformConfigPageProps {
  token: string | null;
}

const TIERS = ['free', 'pro', 'team', 'enterprise'] as const;
const PROVIDERS_DISPLAY: Record<string, string> = {
  google: 'Google Gemini',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
};

export function AdminPlatformConfigPage({ token }: AdminPlatformConfigPageProps) {
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [providers, setProviders] = useState<Record<string, LLMProvider>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tier model form state
  const [tierModels, setTierModels] = useState<Record<string, TierModelConfig>>({});
  const [isSavingTierModels, setIsSavingTierModels] = useState(false);

  // API key form state
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSavingKeys, setIsSavingKeys] = useState(false);

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  const loadData = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [configData, providerData] = await Promise.all([
        platformConfigApi.get(token),
        llmConfigApi.getProviders(token),
      ]);
      setConfig(configData);
      setProviders(providerData.providers);

      // Initialize tier model form from saved config
      const models: Record<string, TierModelConfig> = {};
      for (const tier of TIERS) {
        models[tier] = configData.tier_models[tier] || {
          provider: configData.default_model.provider,
          model: configData.default_model.model,
        };
      }
      setTierModels(models);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTierModels = async () => {
    if (!token) return;
    setIsSavingTierModels(true);
    setError(null);
    try {
      await platformConfigApi.update({ tier_models: tierModels }, token);
      setSuccessMessage('Tier models saved');
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tier models');
    } finally {
      setIsSavingTierModels(false);
    }
  };

  const handleSaveApiKeys = async () => {
    if (!token) return;
    const keysToSave = Object.entries(apiKeyInputs).filter(([, v]) => v.trim());
    if (keysToSave.length === 0) return;

    setIsSavingKeys(true);
    setError(null);
    try {
      // Encrypt each key with RSA before sending
      const pem = await fetchPublicKey(token);
      const encryptedKeys: Record<string, string> = {};
      for (const [provider, plainKey] of keysToSave) {
        encryptedKeys[provider] = await encryptWithPublicKey(plainKey, pem);
      }
      await platformConfigApi.update({ api_keys: encryptedKeys }, token);
      setSuccessMessage('API keys saved securely');
      setApiKeyInputs({});
      setTimeout(() => setSuccessMessage(null), 3000);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API keys');
    } finally {
      setIsSavingKeys(false);
    }
  };

  const updateTierModel = (tier: string, field: 'provider' | 'model', value: string) => {
    setTierModels(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
        ...(field === 'provider' ? { model: '' } : {}),
      },
    }));
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings2 className="w-6 h-6" />
          Platform Configuration
        </h1>
        <p className="text-slate-500 mt-1">
          Configure default AI models per tier and manage platform API keys.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {successMessage && (
        <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Tier Model Configuration */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-1">Default Models by Tier</h2>
        <p className="text-sm text-slate-500 mb-4">
          Set which AI provider and model each user tier gets by default.
        </p>

        <div className="space-y-4">
          {TIERS.map(tier => (
            <div key={tier} className="flex items-center gap-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
              <Badge variant="outline" className="w-24 justify-center capitalize">
                {tier}
              </Badge>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Select
                  value={tierModels[tier]?.provider || ''}
                  onValueChange={v => updateTierModel(tier, 'provider', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROVIDERS_DISPLAY).map(([id, name]) => (
                      <SelectItem key={id} value={id}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={tierModels[tier]?.model || ''}
                  onValueChange={v => updateTierModel(tier, 'model', v)}
                  disabled={!tierModels[tier]?.provider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {(providers[tierModels[tier]?.provider]?.models || []).map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white"
          onClick={handleSaveTierModels}
          disabled={isSavingTierModels}
        >
          {isSavingTierModels ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Tier Models
            </>
          )}
        </Button>
      </Card>

      {/* Platform API Keys */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-1">Platform API Keys</h2>
        <p className="text-sm text-slate-500 mb-4">
          Manage API keys used by the platform for all users. Keys are RSA-encrypted before transmission and AES-256 encrypted at rest.
        </p>

        <div className="p-3 mb-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Keys are encrypted in your browser before being sent to the server. They are never transmitted in plain text.
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(PROVIDERS_DISPLAY).map(([provider, displayName]) => {
            const hasDbKey = config?.api_keys_set[provider];
            return (
              <div key={provider} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{displayName}</span>
                    {hasDbKey && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs gap-1">
                        <Key className="w-3 h-3" />
                        Key Set
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKeys[provider] ? 'text' : 'password'}
                      placeholder={hasDbKey ? 'Enter new key to replace' : `Enter ${displayName} API key`}
                      value={apiKeyInputs[provider] || ''}
                      onChange={e => setApiKeyInputs(prev => ({ ...prev, [provider]: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))}
                    >
                      {showKeys[provider] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-4" />

        <Button
          className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
          onClick={handleSaveApiKeys}
          disabled={isSavingKeys || Object.values(apiKeyInputs).every(v => !v.trim())}
        >
          {isSavingKeys ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Encrypting & Saving...
            </>
          ) : (
            <>
              <Key className="w-4 h-4 mr-2" />
              Save API Keys
            </>
          )}
        </Button>
      </Card>
    </div>
  );
}
