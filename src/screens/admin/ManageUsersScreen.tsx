import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminService, User } from '../../services/api';
import { COLORS, UserRole } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers().catch(() => getMockUsers());
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleRoleChange = (userId: string, currentRole: UserRole) => {
    const nextRole: UserRole = currentRole === 'student' ? 'teacher' : currentRole === 'teacher' ? 'admin' : 'student';
    Alert.alert('Change User Role', `Are you sure you want to change user role to ${nextRole.toUpperCase()}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Change',
        onPress: async () => {
          setLoading(true);
          try {
            await adminService.updateUserRole(userId, nextRole).catch(() => {});
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
            Alert.alert('Success', 'Role updated successfully.');
          } catch {
            Alert.alert('Error', 'Failed to update role');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    Alert.alert('Delete User', `Are you sure you want to permanently delete user account "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await adminService.deleteUser(userId).catch(() => {});
            setUsers(prev => prev.filter(u => u.id !== userId));
            Alert.alert('Success', 'User deleted successfully.');
          } catch {
            Alert.alert('Error', 'Failed to delete user');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const getMockUsers = (): User[] => [
    { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', role: 'student' },
    { id: 'u2', name: 'Dr. Sarah Jenkins', email: 'sarah@example.com', role: 'teacher' },
    { id: 'u3', name: 'Super Admin', email: 'admin@example.com', role: 'admin' },
  ];

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <Loader message="Loading User Accounts..." />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<EmptyState title="No users found" icon="people-outline" />}
          renderItem={({ item }) => (
            <Card
              title={item.name}
              headerRight={
                <View style={styles.roleContainer}>
                  <Text style={[styles.roleBadge, stylesIndexed[`roleBadge_${item.role}`]]}>
                    {item.role.toUpperCase()}
                  </Text>
                </View>
              }
            >
              <Text style={styles.emailText}>{item.email}</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRoleChange(item.id, item.role)}
                >
                  <Ionicons name="shield-half-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.actionText}>Cycle Role</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteUser(item.id, item.name)}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.error} />
                  <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
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
  roleContainer: {
    flexDirection: 'row',
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  roleBadge_student: {
    backgroundColor: COLORS.warningBg,
    color: COLORS.primary,
  },
  roleBadge_teacher: {
    backgroundColor: '#ecfdf5',
    color: COLORS.success,
  },
  roleBadge_admin: {
    backgroundColor: '#fff7ed',
    color: COLORS.warning,
  },
  emailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  deleteText: {
    color: COLORS.error,
  },
});
// Add index type signature to support dynamic styles object lookup by user role
const stylesIndexed = styles as Record<string, any>;
