'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Lock, ArrowLeft, Loader2, AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { waitlistApi, ApiError } from '../../lib/api';
import { useAuth } from '../../lib/auth';

interface InviteSignupPageProps {
  token: string;
  onNavigate: (page: string) => void;
}

type PageState = 'loading' | 'valid' | 'invalid' | 'expired' | 'success';

export function InviteSignupPage({ token, onNavigate }: InviteSignupPageProps) {
  const { login: authLogin } = useAuth();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [inviteData, setInviteData] = useState<{ name: string; email: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate the invite token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await waitlistApi.validateInvite(token);
        if (data.valid) {
          setInviteData({ name: data.name, email: data.email });
          setPageState('valid');
        } else {
          setPageState('invalid');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 410) {
            setErrorDetail(err.message);
            setPageState('expired');
          } else {
            setErrorDetail(err.message);
            setPageState('invalid');
          }
        } else {
          setPageState('invalid');
        }
      }
    };

    if (token) {
      validateToken();
    } else {
      setPageState('invalid');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one digit');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await waitlistApi.registerWithInvite(token, password);

      // Save auth data to localStorage and update auth context
      localStorage.setItem('VoxWrites_token', result.access_token);
      localStorage.setItem('VoxWrites_user', JSON.stringify(result.user));

      // Notify the extension about the auth change
      try {
        window.postMessage({
          type: 'VoxWrites_AUTH_CHANGE',
          token: result.access_token,
          user: result.user,
        }, '*');
      } catch {
        // Extension notification is best-effort
      }

      setPageState('success');

      // Redirect to dashboard after a brief pause
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Validating your invite...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired token
  if (pageState === 'invalid' || pageState === 'expired') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {pageState === 'expired' ? 'Invite Expired' : 'Invalid Invite'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {errorDetail || (pageState === 'expired'
                ? 'This invite link has expired. Please contact support for a new invite.'
                : 'This invite link is invalid or has already been used.')}
            </p>
            <Button variant="outline" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (pageState === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Account Created!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              Welcome to VoxWrites, {inviteData?.name}!
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              Redirecting to your dashboard...
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Valid invite — show password form
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Set your password to complete registration
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              <strong>{inviteData?.name}</strong> — {inviteData?.email}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="invite-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isSubmitting}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Min 8 characters with uppercase, lowercase, and a digit
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="invite-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                  minLength={8}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white"
              disabled={isSubmitting || !password || !confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
