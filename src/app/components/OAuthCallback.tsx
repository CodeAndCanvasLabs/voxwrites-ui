'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { authExtApi } from '../../lib/api';

interface OAuthCallbackProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: (token: string, user: { id: string; email: string; name?: string; tier: string }) => void;
}

export function OAuthCallback({ onNavigate, onAuthSuccess }: OAuthCallbackProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = sessionStorage.getItem('oauth_state');
    const provider = sessionStorage.getItem('oauth_provider') as 'google' | 'github' | null;

    if (!code) {
      setError('No authorization code received.');
      return;
    }

    // CSRF state validation
    if (state && storedState && state !== storedState) {
      setError('Invalid OAuth state. Please try again.');
      return;
    }

    const exchangeCode = async () => {
      try {
        const response = await authExtApi.oauthLogin(provider || 'google', code);

        // Clean up
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_provider');

        // Store auth
        localStorage.setItem('VoxWrites_token', response.access_token);
        localStorage.setItem('VoxWrites_user', JSON.stringify(response.user));

        onAuthSuccess(response.access_token, response.user);
        onNavigate('dashboard');
      } catch (err) {
        setError('OAuth login failed. Please try again.');
      }
    };

    exchangeCode();
  }, [onNavigate, onAuthSuccess]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-bold text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Login Failed</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-slate-600 dark:text-slate-400">Completing sign in...</p>
      </div>
    </div>
  );
}
