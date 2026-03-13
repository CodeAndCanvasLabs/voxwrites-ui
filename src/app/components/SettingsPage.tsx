'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
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
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  ArrowLeft,
  Upload,
  Sparkles,
  Loader2,
  Check,
  Bot,
} from 'lucide-react';
import { useRequireAuth } from '../../lib/auth';
import { toast } from 'sonner';
import { userApi, authExtApi, billingApi, ApiError } from '../../lib/api';
import { AISettingsTab } from './AISettingsTab';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
  embedded?: boolean;
}

export function SettingsPage({ onNavigate, embedded = false }: SettingsPageProps) {
  const { user, token, updateProfile, logout } = useRequireAuth(onNavigate);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    weekly_reports: true,
    product_updates: false,
    marketing_emails: false,
  });

  // Privacy preferences state
  const [privacy, setPrivacy] = useState({
    local_processing: true,
    data_collection: false,
  });

  // Profile preferences state
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [defaultTone, setDefaultTone] = useState('professional');

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load user data and settings
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Load saved settings from backend
  useEffect(() => {
    if (!token) return;
    userApi.getSettings(token).then((settings) => {
      if (settings?.notifications && typeof settings.notifications === 'object') {
        setNotifications((prev) => ({ ...prev, ...(settings.notifications as Record<string, boolean>) }));
      }
      if (settings?.privacy && typeof settings.privacy === 'object') {
        setPrivacy((prev) => ({ ...prev, ...(settings.privacy as Record<string, boolean>) }));
      }
      if (typeof settings?.preferred_language === 'string') {
        setPreferredLanguage(settings.preferred_language);
      }
      if (typeof settings?.default_tone === 'string') {
        setDefaultTone(settings.default_tone);
      }
    }).catch(() => { toast.error('Failed to load settings'); });
  }, [token]);

  const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    if (token) {
      try {
        await userApi.updateSettings(token, { notifications: updated });
      } catch {
        toast.error('Failed to save notification settings');
      }
    }
  };

  const handlePrivacyChange = async (key: keyof typeof privacy, value: boolean) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    if (token) {
      try {
        await userApi.updateSettings(token, { privacy: updated });
      } catch {
        toast.error('Failed to save privacy settings');
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({ name: profile.name });
      await userApi.updateSettings(token, {
        preferred_language: preferredLanguage,
        default_tone: defaultTone,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      // Save failed silently
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;

    setIsDeleting(true);
    try {
      await userApi.deleteAccount(token);
      await logout();
      onNavigate('home');
    } catch (error) {
      // Delete failed silently
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authExtApi.changePassword(currentPassword, newPassword, token);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setPasswordError(err.message);
      } else {
        setPasswordError('Failed to change password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Get user initials
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  // Embedded mode - no outer wrapper
  if (embedded) {
    return (
      <div>
        {/* Sticky Header + Tabs */}
        <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
        <Tabs defaultValue="profile" className="max-w-4xl">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="ai-models">
              <Bot className="w-4 h-4 mr-2" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    Photo upload coming soon
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      title="Email address cannot be changed"
                      className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Default Tone</Label>
                  <Select value={defaultTone} onValueChange={setDefaultTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai-models">
            <AISettingsTab
              token={token ?? null}
              isPro={user?.is_pro ?? false}
              onNavigate={onNavigate}
            />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-500">
                      Receive updates about your account
                    </p>
                  </div>
                  <Switch checked={notifications.email_notifications} onCheckedChange={(v) => handleNotificationChange('email_notifications', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-slate-500">
                      Get weekly usage statistics
                    </p>
                  </div>
                  <Switch checked={notifications.weekly_reports} onCheckedChange={(v) => handleNotificationChange('weekly_reports', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-slate-500">
                      News about features and improvements
                    </p>
                  </div>
                  <Switch checked={notifications.product_updates} onCheckedChange={(v) => handleNotificationChange('product_updates', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-slate-500">
                      Tips and recommendations
                    </p>
                  </div>
                  <Switch checked={notifications.marketing_emails} onCheckedChange={(v) => handleNotificationChange('marketing_emails', v)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Local Processing</p>
                    <p className="text-sm text-slate-500">
                      Process voice locally on your device
                    </p>
                  </div>
                  <Switch checked={privacy.local_processing} onCheckedChange={(v) => handlePrivacyChange('local_processing', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Collection</p>
                    <p className="text-sm text-slate-500">
                      Allow anonymous usage analytics
                    </p>
                  </div>
                  <Switch checked={privacy.data_collection} onCheckedChange={(v) => handlePrivacyChange('data_collection', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Badge variant="outline" className="text-slate-500">Coming soon</Badge>
                </div>

                <Separator />

                {/* Change Password */}
                <div>
                  <p className="font-medium mb-2">Change Password</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Update your account password
                  </p>
                  {passwordError && (
                    <div className="mb-3 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="mb-3 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      Password changed successfully!
                    </div>
                  )}
                  <div className="space-y-3 max-w-sm">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="New password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangePassword}
                      disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Changing...
                        </>
                      ) : passwordSuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Changed!
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-2">Delete Account</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Permanently delete your account and all data
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="dark:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete Account'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Current Plan</h2>
                    <p className="text-slate-500">Manage your subscription</p>
                  </div>
                  <Badge className={user?.is_pro ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white gap-2' : ''}>
                    {user?.is_pro && <Sparkles className="w-4 h-4" />}
                    {user?.tier === 'free' ? 'Free Plan' : `${user?.tier} Plan`}
                  </Badge>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">{user?.is_pro ? '$12' : '$0'}</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {user?.is_pro ? 'Billed monthly' : 'Free forever with limits'}
                  </p>
                  <Button variant="outline" onClick={async () => {
                    if (user?.is_pro && token) {
                      try {
                        const { portal_url } = await billingApi.getPortalUrl(token);
                        window.location.href = portal_url;
                      } catch { onNavigate('pricing'); }
                    } else {
                      onNavigate('pricing');
                    }
                  }}>
                    {user?.is_pro ? 'Manage Subscription' : 'Upgrade to Pro'}
                  </Button>
                </div>

                {user?.is_pro && (
                  <>
                    <h3 className="font-semibold mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Add payment method</p>
                          <p className="text-sm text-slate-500">No card on file</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>Coming soon</Button>
                    </div>
                  </>
                )}
              </Card>

              {user?.is_pro && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Billing History</h3>
                  <div className="text-center py-8 text-slate-500">
                    No billing history yet
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Team Members</h2>
                  <p className="text-slate-500">Invite and manage your team</p>
                </div>
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white" disabled>
                  Invite Member
                  <Badge variant="outline" className="ml-2 text-white border-white/30 text-[10px]">Soon</Badge>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name || 'You'}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Owner</Badge>
                </div>
              </div>

              {!user?.is_pro && (
                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upgrade to Pro or Team plan to invite team members.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-orange-600"
                    onClick={() => onNavigate('pricing')}
                  >
                    View plans
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#161926]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1d2e] border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold mt-4">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="ai-models">
              <Bot className="w-4 h-4 mr-2" />
              AI Models
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2" disabled>
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-slate-500 mt-2">
                    Photo upload coming soon
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      title="Email address cannot be changed"
                      className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Default Tone</Label>
                  <Select value={defaultTone} onValueChange={setDefaultTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai-models">
            <AISettingsTab
              token={token ?? null}
              isPro={user?.is_pro ?? false}
              onNavigate={onNavigate}
            />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-500">
                      Receive updates about your account
                    </p>
                  </div>
                  <Switch checked={notifications.email_notifications} onCheckedChange={(v) => handleNotificationChange('email_notifications', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-slate-500">
                      Get weekly usage statistics
                    </p>
                  </div>
                  <Switch checked={notifications.weekly_reports} onCheckedChange={(v) => handleNotificationChange('weekly_reports', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Product Updates</p>
                    <p className="text-sm text-slate-500">
                      News about features and improvements
                    </p>
                  </div>
                  <Switch checked={notifications.product_updates} onCheckedChange={(v) => handleNotificationChange('product_updates', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-slate-500">
                      Tips and recommendations
                    </p>
                  </div>
                  <Switch checked={notifications.marketing_emails} onCheckedChange={(v) => handleNotificationChange('marketing_emails', v)} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Privacy & Security</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Local Processing</p>
                    <p className="text-sm text-slate-500">
                      Process voice locally on your device
                    </p>
                  </div>
                  <Switch checked={privacy.local_processing} onCheckedChange={(v) => handlePrivacyChange('local_processing', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Collection</p>
                    <p className="text-sm text-slate-500">
                      Allow anonymous usage analytics
                    </p>
                  </div>
                  <Switch checked={privacy.data_collection} onCheckedChange={(v) => handlePrivacyChange('data_collection', v)} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Badge variant="outline" className="text-slate-500">Coming soon</Badge>
                </div>

                <Separator />

                {/* Change Password */}
                <div>
                  <p className="font-medium mb-2">Change Password</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Update your account password
                  </p>
                  {passwordError && (
                    <div className="mb-3 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="mb-3 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      Password changed successfully!
                    </div>
                  )}
                  <div className="space-y-3 max-w-sm">
                    <Input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="New password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangePassword}
                      disabled={isChangingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Changing...
                        </>
                      ) : passwordSuccess ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Changed!
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium mb-2">Delete Account</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Permanently delete your account and all data
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="dark:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete Account'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Current Plan</h2>
                    <p className="text-slate-500">Manage your subscription</p>
                  </div>
                  <Badge className={user?.is_pro ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white gap-2' : ''}>
                    {user?.is_pro && <Sparkles className="w-4 h-4" />}
                    {user?.tier === 'free' ? 'Free Plan' : `${user?.tier} Plan`}
                  </Badge>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">{user?.is_pro ? '$12' : '$0'}</span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {user?.is_pro ? 'Billed monthly' : 'Free forever with limits'}
                  </p>
                  <Button variant="outline" onClick={async () => {
                    if (user?.is_pro && token) {
                      try {
                        const { portal_url } = await billingApi.getPortalUrl(token);
                        window.location.href = portal_url;
                      } catch { onNavigate('pricing'); }
                    } else {
                      onNavigate('pricing');
                    }
                  }}>
                    {user?.is_pro ? 'Manage Subscription' : 'Upgrade to Pro'}
                  </Button>
                </div>

                {user?.is_pro && (
                  <>
                    <h3 className="font-semibold mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">Add payment method</p>
                          <p className="text-sm text-slate-500">No card on file</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" disabled>Coming soon</Button>
                    </div>
                  </>
                )}
              </Card>

              {user?.is_pro && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Billing History</h3>
                  <div className="text-center py-8 text-slate-500">
                    No billing history yet
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Team Members</h2>
                  <p className="text-slate-500">Invite and manage your team</p>
                </div>
                <Button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white" disabled>
                  Invite Member
                  <Badge variant="outline" className="ml-2 text-white border-white/30 text-[10px]">Soon</Badge>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name || 'You'}</p>
                      <p className="text-sm text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">Owner</Badge>
                </div>
              </div>

              {!user?.is_pro && (
                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Upgrade to Pro or Team plan to invite team members.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-orange-600"
                    onClick={() => onNavigate('pricing')}
                  >
                    View plans
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
