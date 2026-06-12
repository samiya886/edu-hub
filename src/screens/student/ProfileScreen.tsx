import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile({ name });
      await updateUser(updatedUser);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to update profile', err);
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <View style={styles.banner}>
          <Text style={styles.kicker}>Academic profile</Text>
          <Text style={styles.bannerTitle}>Your EduHub identity</Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
          <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
        </View>

        <View style={styles.infoContainer}>
          {editing ? (
            <View style={styles.editForm}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
              <View style={styles.editActions}>
                <Button
                  title="Save"
                  onPress={handleUpdate}
                  loading={loading}
                  style={styles.saveBtn}
                />
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => { setName(user?.name || ''); setEditing(false); }}
                  style={styles.cancelBtn}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{user?.name || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.value}>{user?.email || 'N/A'}</Text>
              </View>
              <Button
                title="Edit Profile"
                variant="outline"
                onPress={() => setEditing(true)}
                style={styles.editBtn}
              />
            </>
          )}
        </View>
      </Card>

      <Button
        title="Sign Out"
        variant="danger"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: COLORS.brand,
    padding: 18,
    marginBottom: 18,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 16,
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '800',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '900',
  },
  editBtn: {
    marginTop: 8,
  },
  editForm: {
    gap: 8,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceMuted,
    marginBottom: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveBtn: {
    flex: 1,
    height: 44,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
  },
  logoutBtn: {
    width: '100%',
  },
});
