'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Partners } from './components/Partners';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
// import { SignupPage } from './components/SignupPage'; // WAITLIST MODE: signup disabled
import { Dashboard } from './components/Dashboard';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { BlogPage } from './components/BlogPage';
import { SettingsPage } from './components/SettingsPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { GuidePage } from './components/GuidePage';
import { OAuthCallback } from './components/OAuthCallback';
import { InviteSignupPage } from './components/InviteSignupPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { WaitlistModal } from './components/WaitlistModal';
import { useAuth } from '../lib/auth';

type Page = 'home' | 'features' | 'pricing' | 'about' | 'contact' | 'blog' | 'guide' | 'login' | 'signup' | 'dashboard' | 'settings' | 'forgot-password' | 'oauth-callback' | 'invite' | 'terms' | 'privacy';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Detect special URLs on initial load
    if (window.location.pathname === '/auth/callback') return 'oauth-callback';
    if (window.location.pathname === '/invite' || window.location.search.includes('token=')) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('token')) return 'invite';
    }
    return 'home';
  });
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  // Extract invite token from URL
  const [inviteToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || '';
  });

  const handleOpenWaitlist = () => {
    setWaitlistOpen(true);
  };

  const handleNavigate = (page: string) => {
    // === WAITLIST MODE: Intercept signup navigation ===
    if (page === 'signup') {
      setWaitlistOpen(true);
      return;
    }
    // === END WAITLIST MODE ===
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Redirect to dashboard if already logged in on initial load
  useEffect(() => {
    if (!isLoading && !initialRedirectDone) {
      setInitialRedirectDone(true);
      if (isAuthenticated && (currentPage === 'home' || currentPage === 'login' || currentPage === 'signup')) {
        setCurrentPage('dashboard');
      }
    }
  }, [isAuthenticated, isLoading, currentPage, initialRedirectDone]);

  // Also redirect if user logs in while on login/signup page
  useEffect(() => {
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, currentPage]);

  // Show loading while checking auth on protected pages or initial load
  if (isLoading && !initialRedirectDone) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#161926] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Invite signup page (from email link)
  if (currentPage === 'invite' && inviteToken) {
    return <InviteSignupPage token={inviteToken} onNavigate={handleNavigate} />;
  }

  // Pages that don't show navbar/footer
  if (currentPage === 'login') {
    return (
      <>
        <LoginPage onNavigate={handleNavigate} />
        <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      </>
    );
  }

  // WAITLIST MODE: signup page disabled, redirect to waitlist modal
  // if (currentPage === 'signup') {
  //   return <SignupPage onNavigate={handleNavigate} />;
  // }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }

  if (currentPage === 'oauth-callback') {
    return (
      <OAuthCallback
        onNavigate={handleNavigate}
        onAuthSuccess={() => {
          // Auth context will pick up the new token from localStorage on next render
          window.location.href = '/';
        }}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return <Dashboard onNavigate={handleNavigate} />;
  }

  if (currentPage === 'settings') {
    return <SettingsPage onNavigate={handleNavigate} />;
  }

  // Pages with navbar and footer
  return (
    <div className="min-h-screen">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} onOpenWaitlist={handleOpenWaitlist} />

      {currentPage === 'home' && (
        <>
          <Hero onNavigate={handleNavigate} onOpenWaitlist={handleOpenWaitlist} />
          <Features />
          <Partners />
          <Pricing onNavigate={handleNavigate} onOpenWaitlist={handleOpenWaitlist} />
        </>
      )}

      {currentPage === 'features' && <Features standalone />}

      {currentPage === 'pricing' && <Pricing standalone onNavigate={handleNavigate} onOpenWaitlist={handleOpenWaitlist} />}

      {currentPage === 'about' && <AboutPage />}

      {currentPage === 'contact' && <ContactPage />}

      {currentPage === 'blog' && <BlogPage onNavigate={handleNavigate} />}

      {currentPage === 'terms' && <TermsPage />}

      {currentPage === 'privacy' && <PrivacyPage />}

      <Footer onNavigate={handleNavigate} />
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
}
