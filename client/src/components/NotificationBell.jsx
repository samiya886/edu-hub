import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, CheckCheck, Trash2, BookOpen, FileText,
  LogIn, Edit2, AlertCircle, Info, ShieldCheck, BellOff
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

// ── Helpers ────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  login:    { icon: LogIn,       color: 'text-blue-500',   bg: 'bg-blue-50',   label: 'Login' },
  upload:   { icon: BookOpen,    color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Upload' },
  edit:     { icon: Edit2,       color: 'text-amber-500',  bg: 'bg-amber-50',  label: 'Edit' },
  delete:   { icon: Trash2,      color: 'text-red-500',    bg: 'bg-red-50',    label: 'Delete' },
  admin:    { icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Admin' },
  approval: { icon: CheckCheck,  color: 'text-teal-500',   bg: 'bg-teal-50',   label: 'Approval' },
  info:     { icon: Info,        color: 'text-gray-500',   bg: 'bg-gray-50',   label: 'Info' },
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.info;

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

// ── Panel ──────────────────────────────────────────────────────────────────
const NotificationPanel = ({ notifications, onClose, onMarkRead, onMarkAllRead, onDelete, onClearAll }) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute right-0 top-full mt-3 z-[200] w-[360px] max-w-[calc(100vw-24px)] rounded-[28px] border border-gray-100 bg-white shadow-[0_40px_100px_-30px_rgba(10,74,68,0.35)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#0a4a44] to-[#0d5c55]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Bell size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-white leading-none">Notifications</p>
            {unreadCount > 0 && (
              <p className="text-[10px] font-black text-emerald-100 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors px-2.5 py-1 rounded-lg"
              title="Mark all as read"
            >
              Mark All Read
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 mb-4">
              <BellOff size={28} className="text-gray-300" />
            </div>
            <p className="text-base font-black text-[#0a4a44]">All caught up!</p>
            <p className="text-xs font-semibold text-gray-400 mt-1">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <AnimatePresence>
              {notifications.map((notif) => {
                const config = getTypeConfig(notif.type);
                const TypeIcon = config.icon;
                return (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`relative flex gap-3 p-4 transition-colors hover:bg-gray-50/80 ${!notif.isRead ? 'bg-orange-50/30' : ''}`}
                  >
                    {/* Unread dot */}
                    {!notif.isRead && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#ff9f00]" />
                    )}

                    {/* Icon */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg} mt-0.5`}>
                      <TypeIcon size={16} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${notif.isRead ? 'font-bold text-gray-700' : 'font-black text-[#0a4a44]'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] font-black text-gray-500 mt-1.5 uppercase tracking-widest">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-1">
                      {!notif.isRead && (
                        <button
                          onClick={() => onMarkRead(notif._id)}
                          title="Mark as read"
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-100"
                        >
                          <CheckCheck size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notif._id)}
                        title="Delete"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/60">
          <p className="text-[10px] font-black text-gray-600">{notifications.length} total</p>
          <button
            onClick={onClearAll}
            className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-600 transition-colors"
          >
            Clear All Read
          </button>
        </div>
      )}
    </motion.div>
  );
};

// ── Bell Button ────────────────────────────────────────────────────────────
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead, deleteNotification, clearAll } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        id="notification-bell-btn"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 text-[#0a4a44] shadow-sm transition hover:bg-orange-50 hover:text-[#ff9f00] hover:border-orange-100 focus:outline-none focus:ring-2 focus:ring-[#ff9f00]/40"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <motion.div animate={unreadCount > 0 ? { rotate: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4 }}>
          <Bell size={20} />
        </motion.div>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff9f00] px-1 text-[10px] font-black text-white shadow-lg shadow-orange-200"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <NotificationPanel
            notifications={notifications}
            onClose={() => setOpen(false)}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onDelete={deleteNotification}
            onClearAll={clearAll}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
