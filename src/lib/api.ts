/**
 * VoxWrites API Client
 *
 * Handles all communication with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  tier: string;
  avatar_url?: string;
  is_pro: boolean;
  is_admin?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface AppUsageItem {
  app_type: string;
  transcriptions: number;
  enhancements: number;
  words_count: number;
}

export interface UserStats {
  words_today: number;
  words_this_week: number;
  words_this_month: number;
  words_all_time: number;
  requests_today: number;
  transcriptions_today: number;
  enhancements_today: number;
  limit_reached: boolean;
  remaining_words: number;
  remaining_requests: number;
  remaining_enhancements: number;
  usage_by_app: AppUsageItem[];
}

export interface Transcription {
  id: string;
  user_id: string;
  text: string;
  enhanced_text?: string;
  app_type: string;
  app_name?: string;
  language: string;
  duration_seconds?: number;
  word_count: number;
  tone?: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface TranscribeResponse {
  text: string;
  enhanced_text: string | null;
  language: string;
  duration: number | null;
  word_count: number;
  segments?: Array<{ start: number; end: number; text: string }>;
  saved: boolean;
}

export interface TranscriptionListResponse {
  items: Transcription[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface EnhanceRequest {
  text: string;
  app_type?: string;
  system_prompt?: string;
  remove_filler_words?: boolean;
  email_context?: string;
}

export interface EnhanceResponse {
  original: string;
  enhanced: string;
  changes_made: string[];
  word_count: number;
  processing_time_ms: number;
}

export interface Prompt {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  prompt: string;
  app_type: string;
  is_default: boolean;
  is_active: boolean;
}

export interface AppType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

// API Error
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper to get auth headers
function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Helper for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(token),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new ApiError(response.status, error.detail || 'Request failed');
  }

  return response.json();
}

// =============================================================================
// AUTH API
// =============================================================================

export const authApi = {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Refresh the access token
   */
  async refresh(token: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    }, token);
  },

  /**
   * Get current user
   */
  async me(token: string): Promise<User> {
    return apiRequest<User>('/auth/me', {}, token);
  },

  /**
   * Logout
   */
  async logout(token: string): Promise<void> {
    await apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    }, token);
  },
};

// =============================================================================
// USER API
// =============================================================================

export const userApi = {
  /**
   * Get user profile
   */
  async getProfile(token: string): Promise<User> {
    return apiRequest<User>('/users/profile', {}, token);
  },

  /**
   * Update user profile
   */
  async updateProfile(token: string, data: { name?: string; avatar_url?: string }): Promise<User> {
    return apiRequest<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  },

  /**
   * Get user settings
   */
  async getSettings(token: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>('/users/settings', {}, token);
  },

  /**
   * Update user settings
   */
  async updateSettings(token: string, settings: Record<string, unknown>): Promise<void> {
    await apiRequest<{ message: string }>('/users/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    }, token);
  },

  /**
   * Get user stats
   */
  async getStats(token: string): Promise<UserStats> {
    return apiRequest<UserStats>('/users/stats', {}, token);
  },

  /**
   * Delete user account
   */
  async deleteAccount(token: string): Promise<void> {
    await apiRequest<{ message: string }>('/users/account', {
      method: 'DELETE',
    }, token);
  },
};

// =============================================================================
// ENHANCE API
// =============================================================================

export const enhanceApi = {
  /**
   * Enhance text with AI
   */
  async enhance(request: EnhanceRequest, token?: string): Promise<EnhanceResponse> {
    return apiRequest<EnhanceResponse>('/enhance', {
      method: 'POST',
      body: JSON.stringify(request),
    }, token);
  },

  /**
   * Enhance multiple texts in batch
   */
  async enhanceBatch(requests: EnhanceRequest[], token?: string): Promise<EnhanceResponse[]> {
    return apiRequest<EnhanceResponse[]>('/enhance/batch', {
      method: 'POST',
      body: JSON.stringify(requests),
    }, token);
  },
};

// =============================================================================
// PROMPTS API
// =============================================================================

export const promptsApi = {
  /**
   * Get available app types
   */
  async getAppTypes(): Promise<AppType[]> {
    const response = await apiRequest<{ app_types: AppType[] }>('/prompts/app-types');
    return response.app_types;
  },

  /**
   * Get all prompts (with user overrides if authenticated)
   */
  async list(token?: string, appType?: string): Promise<Prompt[]> {
    const params = appType ? `?app_type=${appType}` : '';
    const response = await apiRequest<{ prompts: Prompt[] }>(`/prompts${params}`, {}, token);
    return response.prompts;
  },

  /**
   * Get prompt for specific app type
   */
  async getByAppType(appType: string, token?: string): Promise<Prompt> {
    return apiRequest<Prompt>(`/prompts/${appType}`, {}, token);
  },

  /**
   * Create or update prompt override
   */
  async saveOverride(appType: string, prompt: string, token: string): Promise<Prompt> {
    return apiRequest<Prompt>(`/prompts/${appType}/override`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }, token);
  },

  /**
   * Reset prompt to default
   */
  async resetToDefault(appType: string, token: string): Promise<void> {
    await apiRequest<{ status: string }>(`/prompts/${appType}/override`, {
      method: 'DELETE',
    }, token);
  },
};

// =============================================================================
// TRANSCRIPTIONS API
// =============================================================================

export const transcriptionsApi = {
  /**
   * Get user's transcription history
   */
  async list(token: string, page: number = 1, pageSize: number = 20, appType?: string): Promise<TranscriptionListResponse> {
    let url = `/transcriptions?page=${page}&page_size=${pageSize}`;
    if (appType) {
      url += `&app_type=${appType}`;
    }
    return apiRequest<TranscriptionListResponse>(url, {}, token);
  },

  /**
   * Create a transcription (save to history)
   */
  async create(token: string, data: { text: string; enhanced_text?: string; app_type?: string; app_name?: string; language?: string; word_count?: number; tone?: string }): Promise<Transcription> {
    return apiRequest<Transcription>('/transcriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  /**
   * Get a specific transcription
   */
  async get(token: string, id: string): Promise<Transcription> {
    return apiRequest<Transcription>(`/transcriptions/${id}`, {}, token);
  },

  /**
   * Update a transcription (favorite, tags)
   */
  async update(token: string, id: string, data: { is_favorite?: boolean; tags?: string[] }): Promise<Transcription> {
    return apiRequest<Transcription>(`/transcriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  },

  /**
   * Delete a transcription
   */
  async delete(token: string, id: string): Promise<void> {
    await apiRequest<{ message: string }>(`/transcriptions/${id}`, {
      method: 'DELETE',
    }, token);
  },
};

// =============================================================================
// EXPORT API (Download transcriptions)
// =============================================================================

export const exportApi = {
  /**
   * Download transcription history in the given format.
   * Uses fetch with auth header, then triggers a file download via blob URL.
   */
  async download(token: string, format: 'csv' | 'markdown' | 'pdf' | 'docx', appType?: string): Promise<void> {
    const params = appType ? `?app_type=${encodeURIComponent(appType)}` : '';
    const url = `${API_BASE_URL}/export/${format}${params}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Export failed' }));
      throw new ApiError(response.status, error.detail || 'Export failed');
    }

    // Extract filename from Content-Disposition header, or use a fallback
    const disposition = response.headers.get('Content-Disposition');
    const filenameMatch = disposition?.match(/filename=(.+)/);
    const ext = format === 'markdown' ? 'md' : format;
    const filename = filenameMatch?.[1] || `VoxWrites_export.${ext}`;

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  },
};

// =============================================================================
// TRANSCRIBE API (Audio File Upload)
// =============================================================================

export const transcribeApi = {
  /**
   * Upload and transcribe an audio file using Whisper API
   */
  async transcribe(
    file: File,
    options: {
      language?: string;
      save_to_history?: boolean;
      enhance?: boolean;
      app_type?: string;
    },
    token: string,
    onProgress?: (percent: number) => void
  ): Promise<TranscribeResponse> {
    const formData = new FormData();
    formData.append('audio', file);
    if (options.language) formData.append('language', options.language);
    if (options.save_to_history) formData.append('save_to_history', 'true');
    if (options.enhance) formData.append('enhance', 'true');
    if (options.app_type) formData.append('app_type', options.app_type);

    // Use XMLHttpRequest for upload progress tracking
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/transcribe`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new ApiError(xhr.status, error.detail || 'Transcription failed'));
            } catch {
              reject(new ApiError(xhr.status, 'Transcription failed'));
            }
          }
        };

        xhr.onerror = () => reject(new ApiError(0, 'Network error'));
        xhr.send(formData);
      });
    }

    // Simple fetch for no-progress case
    const url = `${API_BASE_URL}/transcribe`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Transcription failed' }));
      throw new ApiError(response.status, error.detail || 'Transcription failed');
    }

    return response.json();
  },
};

// =============================================================================
// SNIPPETS API
// =============================================================================

export type SnippetCategory = 'snippet' | 'command';
export type SnippetActionType = 'insert_text' | 'run_ai_command' | 'open_url';

export interface Snippet {
  id: string;
  user_id: string;
  trigger_phrase: string;
  content: string;
  category: SnippetCategory;
  action_type: SnippetActionType;
  action_config: Record<string, unknown> | null;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface SnippetListResponse {
  snippets: Snippet[];
  total: number;
}

export interface CreateSnippetRequest {
  trigger_phrase: string;
  content: string;
  category?: SnippetCategory;
  action_type?: SnippetActionType;
  action_config?: Record<string, unknown>;
}

export interface UpdateSnippetRequest {
  trigger_phrase?: string;
  content?: string;
  category?: SnippetCategory;
  action_type?: SnippetActionType;
  action_config?: Record<string, unknown>;
  is_active?: boolean;
}

export const snippetsApi = {
  async list(token: string, category?: SnippetCategory): Promise<SnippetListResponse> {
    const params = category ? `?category=${category}` : '';
    return apiRequest<SnippetListResponse>(`/snippets${params}`, {}, token);
  },

  async create(token: string, request: CreateSnippetRequest): Promise<Snippet> {
    return apiRequest<Snippet>('/snippets', {
      method: 'POST',
      body: JSON.stringify(request),
    }, token);
  },

  async update(token: string, id: string, request: UpdateSnippetRequest): Promise<Snippet> {
    return apiRequest<Snippet>(`/snippets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }, token);
  },

  async delete(token: string, id: string): Promise<void> {
    await apiRequest<{ status: string }>(`/snippets/${id}`, {
      method: 'DELETE',
    }, token);
  },
};

// =============================================================================
// DICTIONARY API
// =============================================================================

export interface DictionaryEntry {
  id: string;
  user_id: string;
  word: string;
  phonetic_hints: string[];
  category: 'name' | 'technical' | 'medical' | 'legal' | 'custom';
  case_sensitive: boolean;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface DictionaryListResponse {
  entries: DictionaryEntry[];
  total: number;
}

export interface CreateDictionaryEntryRequest {
  word: string;
  phonetic_hints?: string[];
  category?: 'name' | 'technical' | 'medical' | 'legal' | 'custom';
  case_sensitive?: boolean;
  description?: string;
}

export interface UpdateDictionaryEntryRequest {
  word?: string;
  phonetic_hints?: string[];
  category?: 'name' | 'technical' | 'medical' | 'legal' | 'custom';
  case_sensitive?: boolean;
  description?: string;
}

export const dictionaryApi = {
  async list(token: string, category?: string, search?: string): Promise<DictionaryListResponse> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const query = params.toString();
    return apiRequest<DictionaryListResponse>(`/dictionary${query ? `?${query}` : ''}`, {}, token);
  },

  async create(token: string, request: CreateDictionaryEntryRequest): Promise<DictionaryEntry> {
    return apiRequest<DictionaryEntry>('/dictionary', {
      method: 'POST',
      body: JSON.stringify(request),
    }, token);
  },

  async update(token: string, id: string, request: UpdateDictionaryEntryRequest): Promise<DictionaryEntry> {
    return apiRequest<DictionaryEntry>(`/dictionary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }, token);
  },

  async delete(token: string, id: string): Promise<void> {
    await apiRequest<{ status: string }>(`/dictionary/${id}`, {
      method: 'DELETE',
    }, token);
  },
};

// =============================================================================
// STYLES API
// =============================================================================

export interface Style {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  category: string;
  template: string;
  tone?: string;
  instructions?: string;
  icon?: string;
  is_default: boolean;
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface StyleListResponse {
  styles: Style[];
  total: number;
}

export interface CreateStyleRequest {
  name: string;
  description?: string;
  category?: string;
  template: string;
  tone?: string;
  instructions?: string;
  icon?: string;
}

export interface ApplyStyleResponse {
  original: string;
  styled: string;
  style_name: string;
}

export const stylesApi = {
  async list(token: string): Promise<StyleListResponse> {
    return apiRequest<StyleListResponse>('/styles', {}, token);
  },

  async create(token: string, request: CreateStyleRequest): Promise<Style> {
    return apiRequest<Style>('/styles', {
      method: 'POST',
      body: JSON.stringify(request),
    }, token);
  },

  async update(token: string, id: string, request: Partial<CreateStyleRequest>): Promise<Style> {
    return apiRequest<Style>(`/styles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }, token);
  },

  async delete(token: string, id: string): Promise<void> {
    await apiRequest<{ status: string }>(`/styles/${id}`, {
      method: 'DELETE',
    }, token);
  },

  async apply(token: string, styleId: string, text: string): Promise<ApplyStyleResponse> {
    return apiRequest<ApplyStyleResponse>(`/styles/${styleId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }, token);
  },
};

// =============================================================================
// TRANSLATE API
// =============================================================================

export interface TranslateResponse {
  original: string;
  translated: string;
  source_language: string;
  target_language: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface MeetingSummary {
  summary: string;
  key_points: string[];
  action_items: string[];
  decisions: string[];
  participants: string[];
}

export const translateApi = {
  async translate(text: string, targetLanguage: string, sourceLanguage?: string, token?: string): Promise<TranslateResponse> {
    return apiRequest<TranslateResponse>('/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        target_language: targetLanguage,
        source_language: sourceLanguage,
      }),
    }, token);
  },

  async detectLanguage(text: string, token?: string): Promise<{ language: string; code: string; confidence: number }> {
    return apiRequest<{ language: string; code: string; confidence: number }>('/detect', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }, token);
  },

  async getSupportedLanguages(): Promise<Language[]> {
    const response = await apiRequest<{ languages: Language[] }>('/languages');
    return response.languages;
  },
};

export const meetingApi = {
  async summarize(text: string, token?: string): Promise<MeetingSummary> {
    return apiRequest<MeetingSummary>('/meetings/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }, token);
  },
};

// =============================================================================
// AUTH EXTENSIONS (Password Reset, OAuth)
// =============================================================================

export const authExtApi = {
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  },

  async changePassword(currentPassword: string, newPassword: string, token: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }, token);
  },

  async oauthLogin(provider: 'google' | 'github', code: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>(`/auth/oauth/${provider}`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
};

// =============================================================================
// BILLING API
// =============================================================================

export interface SubscriptionInfo {
  tier: string;
  status?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  stripe_customer_id?: string;
}

export const billingApi = {
  async createCheckoutSession(plan: 'monthly' | 'yearly', token: string): Promise<{ checkout_url: string; session_id: string }> {
    return apiRequest<{ checkout_url: string; session_id: string }>('/billing/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }, token);
  },

  async getPortalUrl(token: string): Promise<{ portal_url: string }> {
    return apiRequest<{ portal_url: string }>('/billing/portal', {}, token);
  },

  async getSubscription(token: string): Promise<SubscriptionInfo> {
    return apiRequest<SubscriptionInfo>('/billing/subscription', {}, token);
  },
};

// =============================================================================
// CONTACT & NEWSLETTER API
// =============================================================================

export const contactApi = {
  async sendMessage(data: { name: string; email: string; subject: string; message: string }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// =============================================================================
// WAITLIST API
// =============================================================================

export const waitlistApi = {
  async join(data: { name: string; email: string; use_case: string }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/waitlist/join', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async validateInvite(token: string): Promise<{ valid: boolean; name: string; email: string }> {
    return apiRequest<{ valid: boolean; name: string; email: string }>(`/waitlist/validate-invite?token=${encodeURIComponent(token)}`);
  },

  async registerWithInvite(token: string, password: string): Promise<{ access_token: string; user: { id: string; email: string; name: string; tier: string; is_pro: boolean } }> {
    return apiRequest<{ access_token: string; user: { id: string; email: string; name: string; tier: string; is_pro: boolean } }>('/waitlist/register-invite', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  async list(authToken: string): Promise<{ entries: WaitlistEntry[] }> {
    return apiRequest<{ entries: WaitlistEntry[] }>('/waitlist/list', {}, authToken);
  },

  async approve(waitlistId: string, authToken: string): Promise<{ message: string; email_sent: boolean }> {
    return apiRequest<{ message: string; email_sent: boolean }>(`/waitlist/approve/${waitlistId}`, {
      method: 'POST',
    }, authToken);
  },

  async reject(waitlistId: string, authToken: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/waitlist/reject/${waitlistId}`, {
      method: 'POST',
    }, authToken);
  },
};

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  use_case: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  invite_used_at: string | null;
  is_active: boolean;
  created_at: string;
}

// =============================================================================
// ADMIN API
// =============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  tier: string;
  is_active: boolean;
  is_admin: boolean;
  custom_limits: { daily_words?: number; daily_requests?: number } | null;
  created_at: string;
}

export interface AdminUserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export const adminApi = {
  async listUsers(token: string, search?: string, tier?: string, page: number = 1, pageSize: number = 20): Promise<AdminUserListResponse> {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tier) params.set('tier', tier);
    params.set('page', page.toString());
    params.set('page_size', pageSize.toString());
    const qs = params.toString();
    return apiRequest<AdminUserListResponse>(`/admin/users${qs ? `?${qs}` : ''}`, {}, token);
  },

  async createUser(data: { email: string; name: string; password: string; tier: string }, token: string): Promise<{ message: string; user_id: string }> {
    return apiRequest<{ message: string; user_id: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  async updateTier(userId: string, tier: string, token: string): Promise<{ message: string; changed: boolean }> {
    return apiRequest<{ message: string; changed: boolean }>(`/admin/users/${userId}/tier`, {
      method: 'PUT',
      body: JSON.stringify({ tier }),
    }, token);
  },

  async updateLimits(userId: string, limits: { daily_words?: number | null; daily_requests?: number | null }, token: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/admin/users/${userId}/limits`, {
      method: 'PUT',
      body: JSON.stringify(limits),
    }, token);
  },

  async deleteUser(userId: string, token: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    }, token);
  },
};

// =============================================================================
// LLM CONFIG API
// =============================================================================

export interface LLMProviderModel {
  id: string;
  name: string;
}

export interface LLMProvider {
  name: string;
  models: LLMProviderModel[];
}

export interface LLMConfig {
  id: string;
  provider: string;
  provider_name: string;
  selected_model: string;
  has_api_key: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const llmConfigApi = {
  async getProviders(token: string): Promise<{ providers: Record<string, LLMProvider>; user_tier: string; can_configure: boolean }> {
    return apiRequest<{ providers: Record<string, LLMProvider>; user_tier: string; can_configure: boolean }>('/llm-config/providers', {}, token);
  },

  async listConfigs(token: string): Promise<{ configs: LLMConfig[] }> {
    return apiRequest<{ configs: LLMConfig[] }>('/llm-config', {}, token);
  },

  async saveConfig(data: { provider: string; api_key?: string; selected_model: string; is_active?: boolean }, token: string): Promise<{ message: string; action: string }> {
    return apiRequest<{ message: string; action: string }>('/llm-config', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  },

  async deleteConfig(provider: string, token: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/llm-config/${provider}`, {
      method: 'DELETE',
    }, token);
  },

  async validateKey(provider: string, apiKey: string, token: string, encrypted = false): Promise<{ valid: boolean; message: string }> {
    const payload: Record<string, string> = { provider };
    if (encrypted) {
      payload.encrypted_api_key = apiKey;
    } else {
      payload.api_key = apiKey;
    }
    return apiRequest<{ valid: boolean; message: string }>('/llm-config/validate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token);
  },
};

// =============================================================================
// HEALTH API
// =============================================================================

export const healthApi = {
  async check(): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/health`);
      return true;
    } catch {
      return false;
    }
  },
};

// =============================================================================
// RSA PUBLIC KEY (for transport encryption)
// =============================================================================

let _cachedPublicKeyPem: string | null = null;

export async function fetchPublicKey(token: string): Promise<string> {
  if (_cachedPublicKeyPem) return _cachedPublicKeyPem;
  const result = await apiRequest<{ public_key: string }>('/admin/public-key', {}, token);
  _cachedPublicKeyPem = result.public_key;
  return result.public_key;
}

// =============================================================================
// ADMIN PLATFORM CONFIG API
// =============================================================================

export interface TierModelConfig {
  provider: string;
  model: string;
}

export interface PlatformConfig {
  tier_models: Record<string, TierModelConfig>;
  api_keys_set: Record<string, boolean>;
  default_model: { provider: string; model: string };
}

export const platformConfigApi = {
  async get(token: string): Promise<PlatformConfig> {
    return apiRequest<PlatformConfig>('/admin/platform-config', {}, token);
  },

  async update(data: { tier_models?: Record<string, TierModelConfig>; api_keys?: Record<string, string> }, token: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/admin/platform-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  },
};
