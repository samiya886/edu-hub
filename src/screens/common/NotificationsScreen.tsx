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

  const fetchNotifications = async () => {
    try {
      const list = await notificationService.getNotifications().catch(() => getMockNotifications());
      setNotifications(list);
    } catch (err) {
      console.error('Error fetching notifications', err);
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
      await notificationService.markAsRead(id).catch(() => {});
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getMockNotifications = (): Notification[] => [
    {
      id: 'n1',
      title: 'New Study Guide Uploaded',
      message: 'Dr. Sarah Jenkins uploaded a new study guide "Intro to Computer Networks".',
      type: 'upload',
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: 'n2',
      title: 'Midterm Announcement',
      message: 'All midterm papers for CSE department have been uploaded. Good luck with your preparation!',
      type: 'announcement',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false,
    },
    {
      id: 'n3',
      title: 'System Update Completed',
      message: 'EduHub mobile application version 1.0.0 is live with offline support features.',
      type: 'system',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: true,
    }
  ];

  return (
    <View style={styles.container}>
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
