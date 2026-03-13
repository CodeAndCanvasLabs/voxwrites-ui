import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Github, Twitter, Linkedin, Mail, Check, Loader2, AlertCircle } from 'lucide-react';
import { contactApi } from '../../lib/api';

interface FooterProps {
  onNavigate: (page: string) => void;
}

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

export function Footer({ onNavigate }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) return;

    setSubscribeStatus('loading');
    setErrorMessage('');

    try {
      await contactApi.subscribeNewsletter(newsletterEmail);
      setSubscribeStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 4000);
    } catch (err) {
      setSubscribeStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
      setTimeout(() => setSubscribeStatus('idle'), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold">VoxWrites</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Transform your voice into clear, polished writing with AI-powered enhancement.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => window.open('https://twitter.com/VoxWrites', '_blank')}>
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => window.open('https://github.com/VoxWrites', '_blank')}>
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => window.open('https://linkedin.com/company/VoxWrites', '_blank')}>
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => window.location.href = 'mailto:hello@VoxWrites.ai'}>
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Join Waitlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold mb-2">Stay updated</h4>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest news and updates delivered to your inbox.
            </p>
            {subscribeStatus === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                <Check className="w-5 h-5" />
                <span>Thanks for subscribing!</span>
              </div>
            ) : subscribeStatus === 'error' ? (
              <div className="flex items-center justify-center gap-2 text-red-400 py-2">
                <AlertCircle className="w-5 h-5" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 border-slate-700 text-white"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewsletterSubmit()}
                  disabled={subscribeStatus === 'loading'}
                />
                <Button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
                  onClick={handleNewsletterSubmit}
                  disabled={subscribeStatus === 'loading'}
                >
                  {subscribeStatus === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2026 VoxWrites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
