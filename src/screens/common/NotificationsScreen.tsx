import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationService, Notification } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setError('');
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } catch (err: any) {
      console.error('Error fetching notifications', err);
      setNotifications([]);
      setError(err.response?.data?.message || err.message || 'Notifications are not available right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err: any) {
      console.error('Failed to mark notification as read', err);
      setError(err.response?.data?.message || err.message || 'Failed to update notification.');
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading && !refreshing ? (
        <Loader message="Loading Notifications..." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<EmptyState title="No notifications" icon="notifications-off-outline" />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => !item.read && handleMarkAsRead(item.id)}
            >
              <Card
                style={StyleSheet.flatten([styles.card, !item.read ? styles.unreadCard : undefined])}
                title={item.title}
                headerRight={
                  <View style={styles.badgeRow}>
                    {!item.read && <View style={styles.unreadDot} />}
                    <Ionicons
                      name={
                        item.type === 'upload'
                          ? 'cloud-upload-outline'
                          : item.type === 'announcement'
                          ? 'megaphone-outline'
                          : 'construct-outline'
                      }
                      size={16}
                      color={COLORS.textSecondary}
                    />
                  </View>
                }
              >
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
    margin: 16,
    marginBottom: 0,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  card: {
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: '#f8fafc',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
