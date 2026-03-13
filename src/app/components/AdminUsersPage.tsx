'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
import {
  Search,
  Loader2,
  RefreshCw,
  Crown,
  Shield,
  Edit2,
  AlertCircle,
  Check,
  Users,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminApi, type AdminUser } from '../../lib/api';

interface AdminUsersPageProps {
  token: string | null;
}

export function AdminUsersPage({ token }: AdminUsersPageProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 20;

  // Edit dialog state
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editTier, setEditTier] = useState('');
  const [editDailyWords, setEditDailyWords] = useState('');
  const [editDailyRequests, setEditDailyRequests] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Add user dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newTier, setNewTier] = useState('free');
  const [isCreating, setIsCreating] = useState(false);

  // Delete dialog state
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = async (targetPage?: number) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.listUsers(
        token,
        search || undefined,
        tierFilter !== 'all' ? tierFilter : undefined,
        targetPage ?? page,
        pageSize
      );
      setUsers(data.users);
      setTotalUsers(data.total);
      setHasMore(data.has_more);
      if (targetPage !== undefined) setPage(targetPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadUsers(1);
  }, [token, tierFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadUsers(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const openEditDialog = (user: AdminUser) => {
    setEditUser(user);
    setEditTier(user.tier);
    setEditDailyWords(user.custom_limits?.daily_words?.toString() || '');
    setEditDailyRequests(user.custom_limits?.daily_requests?.toString() || '');
  };

  const handleSave = async () => {
    if (!token || !editUser) return;
    setIsSaving(true);
    setError(null);

    try {
      if (editTier !== editUser.tier) {
        await adminApi.updateTier(editUser.id, editTier, token);
      }

      const limits: { daily_words?: number | null; daily_requests?: number | null } = {};
      if (editDailyWords) {
        limits.daily_words = parseInt(editDailyWords, 10);
      }
      if (editDailyRequests) {
        limits.daily_requests = parseInt(editDailyRequests, 10);
      }

      if (Object.keys(limits).length > 0 || editUser.custom_limits) {
        await adminApi.updateLimits(editUser.id, limits, token);
      }

      setSuccessMessage(`Updated ${editUser.email}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditUser(null);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateUser = async () => {
    if (!token || !newEmail || !newName || !newPassword) return;
    setIsCreating(true);
    setError(null);

    try {
      const result = await adminApi.createUser(
        { email: newEmail, name: newName, password: newPassword, tier: newTier },
        token
      );
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowAddDialog(false);
      setNewEmail('');
      setNewName('');
      setNewPassword('');
      setNewTier('free');
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!token || !deleteUser) return;
    setIsDeleting(true);
    setError(null);

    try {
      const result = await adminApi.deleteUser(deleteUser.id, token);
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteUser(null);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const tierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      free: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      pro: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      team: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      enterprise: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return (
      <Badge className={colors[tier] || colors.free}>
        {tier === 'pro' && <Crown className="w-3 h-3 mr-1" />}
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage users, tiers, and usage limits
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadUsers()} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Users List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/50" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700/50 rounded" />
                    <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700/50 rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No users found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {search || tierFilter !== 'all' ? 'Try adjusting your filters.' : 'No users have registered yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {users.map((u, index) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                            {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold truncate">{u.name || 'No name'}</span>
                            {tierBadge(u.tier)}
                            {u.is_admin && (
                              <Badge variant="outline" className="text-xs gap-1">
                                <Shield className="w-3 h-3" />
                                Admin
                              </Badge>
                            )}
                            {u.custom_limits && (
                              <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400">
                                Custom limits
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{u.email}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Joined {new Date(u.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(u)}
                          className="gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        {!u.is_admin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteUser(u)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-400">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalUsers)} of {totalUsers} user{totalUsers !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadUsers(page - 1)}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadUsers(page + 1)}
                disabled={!hasMore || isLoading}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {totalPages <= 1 && users.length > 0 && (
          <p className="text-xs text-slate-400 mt-4 text-center">
            {totalUsers} user{totalUsers !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {editUser && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{editUser.name || 'No name'}</p>
                <p className="text-sm text-slate-500">{editUser.email}</p>
              </div>

              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <Select value={editTier} onValueChange={setEditTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Custom Daily Word Limit</Label>
                <Input
                  type="number"
                  placeholder="Default (tier-based)"
                  value={editDailyWords}
                  onChange={(e) => setEditDailyWords(e.target.value)}
                  min={0}
                />
                <p className="text-xs text-slate-500">
                  Leave empty for tier defaults (Free: 1,000 / Pro: unlimited)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Custom Daily Request Limit</Label>
                <Input
                  type="number"
                  placeholder="Default (tier-based)"
                  value={editDailyRequests}
                  onChange={(e) => setEditDailyRequests(e.target.value)}
                  min={0}
                />
                <p className="text-xs text-slate-500">
                  Leave empty for tier defaults (Free: 50 / Pro: unlimited)
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
          </DialogHeader>
          {deleteUser && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to delete this user? This will permanently remove their account and all associated data.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="font-medium">{deleteUser.name || 'No name'}</p>
                <p className="text-sm text-slate-500">{deleteUser.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setNewEmail('');
          setNewName('');
          setNewPassword('');
          setNewTier('free');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add New User
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={newTier} onValueChange={setNewTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white"
              onClick={handleCreateUser}
              disabled={isCreating || !newEmail || !newName || !newPassword || newPassword.length < 8}
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
