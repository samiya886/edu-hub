import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Trash2, Search, Bell, Users, Shield, BookOpen,
  GraduationCap, AlertCircle, Loader2, CheckCheck, RefreshCw,
  Info, LogIn, Edit2, FileText, ShieldCheck, X, Plus
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

import { API_URL } from '../config/api';

// ── Helpers ────────────────────────────────────────────────────────────────
const TYPE_OPTIONS = [
  { value: 'info',    label: 'Info',     icon: Info },
  { value: 'admin',   label: 'Admin',    icon: ShieldCheck },
  { value: 'upload',  label: 'Upload',   icon: BookOpen },
  { value: 'edit',    label: 'Edit',     icon: Edit2 },
  { value: 'delete',  label: 'Delete',   icon: Trash2 },
  { value: 'login',   label: 'Login',    icon: LogIn },
  { value: 'approval',label: 'Approval', icon: CheckCheck },
];

const AUDIENCE_OPTIONS = [
  { value: 'all',     label: 'Everyone',        icon: Users },
  { value: 'admin',   label: 'Admins Only',      icon: Shield },
  { value: 'teacher', label: 'Teachers Only',    icon: GraduationCap },
  { value: 'student', label: 'Students Only',    icon: BookOpen },
];

const TYPE_COLORS = {
  login:    'text-blue-500 bg-blue-50',
  upload:   'text-emerald-500 bg-emerald-50',
  edit:     'text-amber-500 bg-amber-50',
  delete:   'text-red-500 bg-red-50',
  admin:    'text-purple-500 bg-purple-50',
  approval: 'text-teal-500 bg-teal-50',
  info:     'text-gray-500 bg-gray-50',
};

const formatDate = (str) => {
  if (!str) return '';
  const d = new Date(str);
  return d.toLocaleString('en', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// ── Send Form ──────────────────────────────────────────────────────────────
const SendNotificationForm = ({ onSent }) => {
  const { sendNotification } = useNotifications();
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info',
    audience: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendNotification({
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
        recipientRoles: [form.audience],
      });
      setSuccess(true);
      setForm({ title: '', message: '', type: 'info', audience: 'all' });
      onSent?.();
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a4a44] text-white">
          <Send size={18} />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#0a4a44]">Send Notification</h2>
          <p className="text-xs font-bold text-gray-600">Broadcast a message to any user group</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-widest text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Notification title..."
            className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-4 py-3 font-bold text-[#0a4a44] outline-none transition focus:border-[#ff9f00] focus:bg-white placeholder:text-gray-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-widest text-gray-700 mb-2">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            placeholder="Write your message here..."
            rows={3}
            className="w-full rounded-2xl border-2 border-transparent bg-gray-50 px-4 py-3 font-semibold text-[#0a4a44] outline-none transition focus:border-[#ff9f00] focus:bg-white placeholder:text-gray-500 resize-none"
          />
        </div>

        <div className="space-y-4">
          {/* Audience */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-700 mb-2">Send To (Audience)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AUDIENCE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, audience: value }))}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-black transition-all border-2 ${
                    form.audience === value
                      ? 'border-[#ff9f00] bg-orange-50 text-[#0a4a44]'
                      : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#0a4a44]'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-bold text-red-600">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-bold text-emerald-600"
            >
              <CheckCheck size={16} /> Notification sent successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0a4a44] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-[#083a35] disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Sending...</>
          ) : (
            <><Send size={16} /> Send Notification</>
          )}
        </button>
      </form>
    </motion.div>
  );
};

// ── All Notifications Table ────────────────────────────────────────────────
const AllNotificationsTable = ({ refresh }) => {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const token = () => localStorage.getItem('token');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT, search });
      const res = await fetch(`${API_URL}/notifications/all?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setTotal(data.total || 0);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchAll(); }, [fetchAll, refresh]);

  const deleteOne = async (id) => {
    try {
      await fetch(`${API_URL}/notifications/any/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setTotal((t) => t - 1);
    } catch { /* noop */ }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff9f00]/10">
            <Bell size={18} className="text-[#ff9f00]" />
          </div>
          <div>
            <h3 className="font-black text-[#0a4a44]">All Notifications</h3>
            <p className="text-[10px] font-bold text-gray-400">{total} total in system</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search notifications..."
              className="w-full sm:w-56 rounded-xl bg-gray-50 py-2.5 pl-9 pr-4 text-sm font-bold text-[#0a4a44] outline-none focus:ring-2 focus:ring-[#ff9f00]/30"
            />
          </div>
          <button
            onClick={fetchAll}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#0a4a44] transition-all"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-16 text-center">
          <AlertCircle size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="font-black text-[#0a4a44]">No notifications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-700">Title / Message</th>
                <th className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-700 hidden md:table-cell">Audience</th>
                <th className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-700 hidden sm:table-cell">Sent By</th>
                <th className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-700 hidden lg:table-cell">Date</th>
                <th className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-gray-700 hidden sm:table-cell">Read</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <motion.tr
                  key={n._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-3 max-w-[250px]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`}>
                        {n.type}
                      </span>
                      <p className="font-black text-[#0a4a44] truncate">{n.title}</p>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold truncate mt-0.5">{n.message}</p>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(n.recipientRoles || []).map((r) => (
                        <span key={r} className="inline-flex items-center gap-1 rounded-full bg-[#0a4a44]/8 px-2 py-0.5 text-[10px] font-black text-[#0a4a44] capitalize">
                          {r}
                        </span>
                      ))}
                      {(n.recipientUsers || []).length > 0 && (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                          +{n.recipientUsers.length} users
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell text-xs font-bold text-gray-700">
                    {n.createdBy?.name || n.createdBy?.email || 'System'}
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell text-xs font-bold text-gray-600 whitespace-nowrap">
                    {formatDate(n.createdAt)}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-black text-gray-600">
                      <CheckCheck size={12} className="text-emerald-500" />
                      {(n.readBy || []).length}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => deleteOne(n._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-[#0a4a44] disabled:opacity-40 hover:bg-gray-50"
          >
            Prev
          </button>
          <p className="text-xs font-black text-gray-700">Page {page} of {totalPages}</p>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-black text-[#0a4a44] disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ── Main Panel ─────────────────────────────────────────────────────────────
const NotificationHandlerPanel = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0a4a44] to-[#0d5c55] p-8"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff9f00] shadow-lg shadow-orange-900/30">
            <Bell size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Notification Handler</h1>
            <p className="text-teal-200/70 font-medium text-sm mt-0.5">
              Broadcast announcements and manage system-wide notifications
            </p>
          </div>
        </div>
      </motion.div>

      <SendNotificationForm onSent={() => setRefreshKey((k) => k + 1)} />
      <AllNotificationsTable refresh={refreshKey} />
    </div>
  );
};

export default NotificationHandlerPanel;
