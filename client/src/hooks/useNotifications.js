import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const API_URL = '/api';
const POLL_INTERVAL = 30000; // 30 seconds

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const token = () => localStorage.getItem('token');

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      // Silently fail — polling will retry
    }
  }, [user]);

  // Initial fetch + polling
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    fetchNotifications().finally(() => setLoading(false));

    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [user, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = useCallback(async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch { /* noop */ }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* noop */ }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch { /* noop */ }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await fetch(`${API_URL}/notifications/clear`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* noop */ }
  }, []);

  // Admin: send a notification
  const sendNotification = useCallback(async (payload) => {
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send notification');
    // Refresh list
    fetchNotifications();
    return data;
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    clearAll,
    sendNotification,
  };
}
