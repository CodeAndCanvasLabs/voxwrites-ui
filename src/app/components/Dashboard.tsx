'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import {
  Settings,
  LogOut,
  Sparkles,
  TrendingUp,
  Clock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  History,
  Zap,
  ArrowRight,
  Play,
  BarChart3,
  BookOpen,
  BookMarked,
  Paintbrush,
  Languages,
  Loader2,
  UserPlus,
  Users,
  FileAudio,
  Settings2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRequireAuth } from '../../lib/auth';
import { userApi, promptsApi, transcriptionsApi, billingApi, type UserStats, type AppType, type Transcription } from '../../lib/api';
import { PromptsPage } from './PromptsPage';
import { SettingsPage } from './SettingsPage';
import { HistoryPage } from './HistoryPage';
import { SnippetsPage } from './SnippetsPage';
import { PlaygroundPage } from './PlaygroundPage';
import { GuidePage } from './GuidePage';
import { DictionaryPage } from './DictionaryPage';
import { StylesPage } from './StylesPage';
import { TranslatePage } from './TranslatePage';
import { WaitlistAdminPage } from './WaitlistAdminPage';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminPlatformConfigPage } from './AdminPlatformConfigPage';
import { TranscribePage } from './TranscribePage';
import { ThemeToggle } from './ThemeToggle';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

type TabType = 'dashboard' | 'playground' | 'transcribe' | 'history' | 'snippets' | 'dictionary' | 'styles' | 'translate' | 'prompts' | 'guide' | 'settings' | 'waitlist' | 'admin-users' | 'admin-platform';

const baseSidebarTabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'playground' as TabType, label: 'Playground', icon: Play },
  { id: 'transcribe' as TabType, label: 'Transcribe', icon: FileAudio },
  { id: 'history' as TabType, label: 'History', icon: History },
  { id: 'snippets' as TabType, label: 'Snippets', icon: Zap },
  { id: 'dictionary' as TabType, label: 'Dictionary', icon: BookMarked },
  { id: 'styles' as TabType, label: 'Styles', icon: Paintbrush },
  { id: 'translate' as TabType, label: 'Translate', icon: Languages },
  { id: 'prompts' as TabType, label: 'Prompts', icon: MessageSquare },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, token, logout } = useRequireAuth(onNavigate);
  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    const saved = sessionStorage.getItem('VoxWrites-active-tab');
    return (saved as TabType) || 'dashboard';
  });
  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    sessionStorage.setItem('VoxWrites-active-tab', tab);
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [appTypes, setAppTypes] = useState<AppType[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [recentTranscriptions, setRecentTranscriptions] = useState<Transcription[]>([]);
  const [isLoadingTranscriptions, setIsLoadingTranscriptions] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Build sidebar tabs - admin tab only for verified admins (is_admin comes from /me backend response)
  const sidebarTabs = user?.is_admin
    ? [...baseSidebarTabs, { id: 'waitlist' as TabType, label: 'Waitlist', icon: UserPlus }, { id: 'admin-users' as TabType, label: 'Users', icon: Users }, { id: 'admin-platform' as TabType, label: 'Platform', icon: Settings2 }]
    : baseSidebarTabs;

  const handleUpgrade = async () => {
    if (!token) return;
    setCheckoutLoading(true);
    try {
      const { checkout_url } = await billingApi.createCheckoutSession('monthly', token);
      window.location.href = checkout_url;
    } catch {
      // Fallback to pricing page if checkout fails
      onNavigate('pricing');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Load stats, app types, and transcriptions on mount
  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      try {
        // Load stats
        const userStats = await userApi.getStats(token);
        setStats(userStats);

        // Load app types
        const types = await promptsApi.getAppTypes();
        setAppTypes(types);

        // Load recent transcriptions
        setIsLoadingTranscriptions(true);
        const transcriptions = await transcriptionsApi.list(token, 1, 5);
        setRecentTranscriptions(transcriptions.items);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoadingStats(false);
        setIsLoadingTranscriptions(false);
      }
    };

    loadData();
  }, [token]);

  const handleLogout = async () => {
    await logout();
    onNavigate('home');
  };

  const statCards = [
    {
      label: 'Words Today',
      value: stats?.words_today?.toLocaleString() || '0',
      subtitle: 'transcribed + enhanced',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Words This Week',
      value: stats?.words_this_week?.toLocaleString() || '0',
      subtitle: 'total words processed',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Words Remaining',
      value: (stats?.remaining_words ?? 0) >= 999999
        ? 'Unlimited'
        : stats?.remaining_words?.toLocaleString() || '0',
      subtitle: (stats?.remaining_words ?? 0) >= 999999
        ? 'no daily limit'
        : `of ${user?.tier === 'free' ? '1,000' : 'custom limit'} daily`,
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      label: 'AI Requests Left',
      value: (stats?.remaining_enhancements ?? 0) >= 999999
        ? 'Unlimited'
        : stats?.remaining_enhancements?.toLocaleString() || '0',
      subtitle: (stats?.remaining_enhancements ?? 0) >= 999999
        ? 'no daily limit'
        : `${stats?.enhancements_today || 0} of ${user?.tier === 'free' ? '50' : user?.tier === 'pro' ? '100' : '200'} used today`,
      icon: Sparkles,
      color: 'text-orange-600',
    },
  ];

  // Helper to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // App type to label mapping
  const getAppLabel = (appType: string) => {
    const type = appTypes.find(t => t.value === appType);
    return type?.label || appType;
  };

  // Get user initials
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'playground':
        return <PlaygroundPage token={token} />;
      case 'transcribe':
        return <TranscribePage token={token} />;
      case 'history':
        return <HistoryPage token={token} />;
      case 'snippets':
        return <SnippetsPage token={token} />;
      case 'dictionary':
        return <DictionaryPage token={token} />;
      case 'styles':
        return <StylesPage token={token} />;
      case 'translate':
        return <TranslatePage token={token} />;
      case 'prompts':
        return <PromptsPage token={token} />;
      case 'guide':
        return <GuidePage />;
      case 'settings':
        return <SettingsPage onNavigate={onNavigate} embedded />;
      case 'waitlist':
        return user?.is_admin ? <WaitlistAdminPage token={token} /> : null;
      case 'admin-users':
        return user?.is_admin ? <AdminUsersPage token={token} /> : null;
      case 'admin-platform':
        return user?.is_admin ? <AdminPlatformConfigPage token={token} /> : null;
      default:
        return (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Transcription */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {stat.label}
                          </p>
                          <p className="text-xl font-bold">
                            {isLoadingStats ? (
                              <span className="animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded w-16 h-6 inline-block" />
                            ) : (
                              stat.value
                            )}
                          </p>
                          {stat.subtitle && (
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                              {stat.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* App Usage Breakdown */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    <h2 className="text-lg font-semibold">App Usage</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('history')}
                    className="text-slate-500"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {isLoadingStats ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/50 rounded" />
                          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700/50 rounded" />
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700/50 rounded" />
                      </div>
                    ))}
                  </div>
                ) : stats?.usage_by_app && stats.usage_by_app.length > 0 ? (
                  <div className="space-y-4">
                    {stats.usage_by_app
                      .sort((a, b) => b.words_count - a.words_count)
                      .slice(0, 6)
                      .map((app) => {
                        const maxWords = stats.usage_by_app[0]?.words_count || 1;
                        const percentage = Math.round((app.words_count / (stats.words_all_time || 1)) * 100);
                        return (
                          <div key={app.app_type}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {getAppLabel(app.app_type)}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {app.transcriptions} transcription{app.transcriptions !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {app.words_count.toLocaleString()} words
                              </span>
                            </div>
                            <Progress
                              value={(app.words_count / maxWords) * 100}
                              className="h-2 bg-orange-100 dark:bg-orange-900/30 [&>[data-slot=progress-indicator]]:bg-orange-500"
                            />
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No usage data yet</p>
                    <p className="text-xs text-slate-400">
                      Start using VoxWrites to see app usage breakdown
                    </p>
                  </div>
                )}
              </Card>

              {/* Playground CTA */}
              <Card
                className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('playground')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Try the Playground</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Paste text and enhance it with AI - pick context, tone, and transform
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </Card>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Transcriptions</h3>
                <div className="space-y-3">
                  {isLoadingTranscriptions ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse mb-2" />
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse" />
                          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700/50 rounded animate-pulse" />
                        </div>
                      </div>
                    ))
                  ) : recentTranscriptions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No transcriptions yet</p>
                      <p className="text-xs text-slate-400">Start recording to see your history</p>
                    </div>
                  ) : (
                    recentTranscriptions.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <p className="text-sm font-medium line-clamp-1 mb-1">
                          {item.text}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {item.app_name || getAppLabel(item.app_type)}
                          </Badge>
                          <span className="text-xs text-slate-500">{formatTimeAgo(item.created_at)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {recentTranscriptions.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('history')}
                  >
                    View All History
                  </Button>
                )}
              </Card>

              {!user?.is_pro && (
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Get unlimited transcriptions, advanced AI features, and more.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white"
                    onClick={handleUpgrade}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                </Card>
              )}

              {stats?.limit_reached && (
                <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    Daily Limit Reached
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    You've reached a daily usage limit. Upgrade your plan or add your own API key in Settings for unlimited AI enhancements.
                  </p>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleUpgrade}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : (
                      'Upgrade Now'
                    )}
                  </Button>
                </Card>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-[#161926] flex overflow-hidden">
      {/* Collapsible Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 64 : 240 }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-[#1a1d2e] border-r border-slate-200 dark:border-slate-700/50 z-40 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700/50">
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  VoxWrites
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 ${
                isSidebarCollapsed ? 'px-3' : 'px-4'
              } ${
                activeTab === tab.id
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-orange-100 text-orange-600 text-sm">
                {getInitials(user?.name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex-1"
                >
                  <p className="text-sm font-medium truncate">{user?.name || user?.email}</p>
                  <Badge className="text-xs" variant={user?.is_pro ? 'default' : 'secondary'}>
                    {user?.tier || 'Free'}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            variant={activeTab === 'guide' ? 'secondary' : 'ghost'}
            className={`w-full mt-2 ${
              isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'
            } ${
              activeTab === 'guide'
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
            onClick={() => setActiveTab('guide')}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 overflow-hidden whitespace-nowrap"
                >
                  Guide
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
          <Button
            variant="ghost"
            className={`w-full mt-1 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500 ${
              isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'
            }`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 overflow-hidden whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col h-screen transition-all duration-300"
        style={{ marginLeft: isSidebarCollapsed ? 64 : 240 }}
      >
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-[#1a1d2e] border-b border-slate-200 dark:border-slate-700/50 z-30 flex-shrink-0">
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content - scrollable area */}
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
