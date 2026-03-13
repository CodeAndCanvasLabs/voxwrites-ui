'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Check,
  X,
  Loader2,
  Mail,
  UserPlus,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  CheckSquare,
  Square,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { waitlistApi, type WaitlistEntry } from '../../lib/api';

interface WaitlistAdminPageProps {
  token: string | null;
}

export function WaitlistAdminPage({ token }: WaitlistAdminPageProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBatchApproving, setIsBatchApproving] = useState(false);

  const loadEntries = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await waitlistApi.list(token);
      setEntries(data.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load waitlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [token]);

  const handleApprove = async (entry: WaitlistEntry) => {
    if (!token) return;
    setActionLoading(entry.id);
    setSuccessMessage(null);
    try {
      const result = await waitlistApi.approve(entry.id, token);
      setSuccessMessage(result.message);
      // Update local state
      setEntries(prev =>
        prev.map(e => e.id === entry.id ? { ...e, status: 'approved' as const } : e)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (entry: WaitlistEntry) => {
    if (!token) return;
    setActionLoading(entry.id);
    setSuccessMessage(null);
    try {
      await waitlistApi.reject(entry.id, token);
      setEntries(prev =>
        prev.map(e => e.id === entry.id ? { ...e, status: 'rejected' as const } : e)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getStatusBadge = (entry: WaitlistEntry) => {
    if (entry.invite_used_at) {
      return <Badge className="bg-green-500 text-white">Registered</Badge>;
    }
    switch (entry.status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-500 text-white"><Mail className="w-3 h-3 mr-1" />Invite Sent</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="secondary">{entry.status}</Badge>;
    }
  };

  const pendingCount = entries.filter(e => e.status === 'pending').length;
  const approvedCount = entries.filter(e => e.status === 'approved' && !e.invite_used_at).length;
  const registeredCount = entries.filter(e => e.invite_used_at).length;

  const filteredEntries = useMemo(() => {
    let filtered = entries;

    if (statusFilter !== 'all') {
      if (statusFilter === 'registered') {
        filtered = filtered.filter(e => !!e.invite_used_at);
      } else {
        filtered = filtered.filter(e => e.status === statusFilter && !e.invite_used_at);
      }
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(lowerSearch) ||
        e.email.toLowerCase().includes(lowerSearch) ||
        (e.use_case && e.use_case.toLowerCase().includes(lowerSearch))
      );
    }

    return filtered;
  }, [entries, search, statusFilter]);

  const pendingIds = useMemo(
    () => filteredEntries.filter(e => e.status === 'pending').map(e => e.id),
    [filteredEntries]
  );

  const allPendingSelected = pendingIds.length > 0 && pendingIds.every(id => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (allPendingSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingIds));
    }
  };

  const handleBatchApprove = async () => {
    if (!token || selectedIds.size === 0) return;
    setIsBatchApproving(true);
    setError(null);

    const ids = Array.from(selectedIds);
    const results = await Promise.allSettled(
      ids.map(id => waitlistApi.approve(id, token))
    );

    let approved = 0;
    let failed = 0;
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        approved++;
        setEntries(prev =>
          prev.map(e => e.id === ids[i] ? { ...e, status: 'approved' as const } : e)
        );
      } else {
        failed++;
      }
    });

    setSelectedIds(new Set());
    setIsBatchApproving(false);

    if (failed > 0) {
      setError(`Approved ${approved}, failed ${failed}`);
    } else {
      setSuccessMessage(`Approved ${approved} user${approved !== 1 ? 's' : ''} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Waitlist Management</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Review and approve waitlist entries
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadEntries} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{pendingCount}</div>
            <div className="text-xs text-slate-500">Pending</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{approvedCount}</div>
            <div className="text-xs text-slate-500">Invite Sent</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{registeredCount}</div>
            <div className="text-xs text-slate-500">Registered</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Invite Sent</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          {pendingIds.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="gap-1"
              >
                {allPendingSelected ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {allPendingSelected ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedIds.size > 0 && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white gap-1"
                  onClick={handleBatchApprove}
                  disabled={isBatchApproving}
                >
                  {isBatchApproving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve Selected ({selectedIds.size})
                </Button>
              )}
            </div>
          )}
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

        {/* Loading */}
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
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {entries.length === 0 ? 'No waitlist entries yet' : 'No matching entries'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {entries.length === 0
                ? 'When users join the waitlist, they\'ll appear here.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {entry.status === 'pending' && (
                          <button
                            onClick={() => toggleSelect(entry.id)}
                            className="mt-2.5 flex-shrink-0 text-slate-400 hover:text-orange-500 transition-colors"
                          >
                            {selectedIds.has(entry.id) ? (
                              <CheckSquare className="w-5 h-5 text-orange-500" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                          </button>
                        )}
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 font-semibold text-sm">
                            {entry.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold truncate">{entry.name}</span>
                            {getStatusBadge(entry)}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{entry.email}</p>
                          {entry.use_case && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                              {entry.use_case}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(entry.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      {entry.status === 'pending' && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(entry)}
                            disabled={actionLoading === entry.id}
                          >
                            {actionLoading === entry.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-600 hover:border-red-300"
                            onClick={() => handleReject(entry)}
                            disabled={actionLoading === entry.id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {entry.status === 'approved' && !entry.invite_used_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(entry)}
                          disabled={actionLoading === entry.id}
                        >
                          {actionLoading === entry.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-1" />
                              Resend
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
