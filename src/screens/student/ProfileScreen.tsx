import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { COLORS, SHADOWS } from '../../constants';
import { Button } from '../../components/Button';

type IconName = keyof typeof Ionicons.glyphMap;

function formatRole(role?: string) {
  if (!role) return 'Student';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function formatDate(value?: string) {
  if (!value) return 'Recently joined';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently joined';

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.profileRow}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={COLORS.brand} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  danger,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionRow} activeOpacity={0.82} onPress={onPress}>
      <View style={[styles.actionIcon, danger && styles.actionIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? COLORS.error : COLORS.brand} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={[styles.actionTitle, danger && styles.actionTitleDanger]}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const initials = useMemo(() => {
    const parts = (user?.name || 'EduHub User')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'U';
  }, [user?.name]);

  const roleLabel = formatRole(user?.role);

  const handleUpdate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert('Name required', 'Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile({ name: trimmedName });
      await updateUser(updatedUser);
      setName(updatedUser.name || trimmedName);
      setEditing(false);
      Alert.alert('Profile updated', 'Your profile details are up to date.');
    } catch (err: any) {
      console.error('Failed to update profile', err);
      Alert.alert('Update failed', err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sign out', 'Do you want to sign out of EduHub?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.kicker}>Profile</Text>
            <Text style={styles.heroTitle}>Your EduHub account</Text>
          </View>
          <TouchableOpacity style={styles.editIconButton} activeOpacity={0.82} onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={19} color={COLORS.brand} />
          </TouchableOpacity>
        </View>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={styles.name} numberOfLines={1}>{user?.name || 'EduHub User'}</Text>
            <Text style={styles.email} numberOfLines={1}>{user?.email || 'No email added'}</Text>
          </View>
        </View>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.primary} />
            <Text style={styles.chipText}>{roleLabel}</Text>
          </View>
          <View style={styles.chipMuted}>
            <View style={styles.statusDot} />
            <Text style={styles.chipMutedText}>Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Personal Details</Text>
          {!editing ? (
            <TouchableOpacity activeOpacity={0.78} onPress={() => setEditing(true)}>
              <Text style={styles.cardAction}>Edit</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {editing ? (
          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.placeholder}
              autoCapitalize="words"
            />
            <View style={styles.editActions}>
              <Button title="Save" onPress={handleUpdate} loading={loading} style={styles.saveButton} />
              <Button title="Cancel" variant="outline" onPress={handleCancel} style={styles.cancelButton} />
            </View>
          </View>
        ) : (
          <View style={styles.details}>
            <ProfileRow icon="person-outline" label="Name" value={user?.name || 'Not available'} />
            <ProfileRow icon="mail-outline" label="Email" value={user?.email || 'Not available'} />
            <ProfileRow icon="school-outline" label="Role" value={roleLabel} />
            <ProfileRow icon="calendar-outline" label="Member since" value={formatDate(user?.createdAt)} />
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.actions}>
          <ActionRow
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password and account access"
            onPress={() => Alert.alert('Security', 'Password settings will be available soon.')}
          />
          <ActionRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Updates about notes and papers"
            onPress={() => Alert.alert('Notifications', 'Notification preferences will be available soon.')}
          />
          <ActionRow
            icon="log-out-outline"
            title="Sign Out"
            subtitle="End this session on your device"
            danger
            onPress={handleLogout}
          />
        </View>
      </View>
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
    paddingBottom: 28,
  },
  hero: {
    backgroundColor: COLORS.brand,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
    marginTop: 5,
  },
  editIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 22,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '900',
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
  },
  email: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  chip: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  chipText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
  },
  chipMuted: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  chipMutedText: {
    color: COLORS.brand,
    fontSize: 12,
    fontWeight: '900',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '900',
  },
  cardAction: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  details: {
    gap: 10,
  },
  profileRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rowValue: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  editForm: {
    gap: 10,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.textDark,
    backgroundColor: COLORS.surfaceMuted,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  saveButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
  },
  actions: {
    marginTop: 12,
    gap: 10,
  },
  actionRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  actionIconDanger: {
    backgroundColor: COLORS.errorBg,
  },
  actionCopy: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '900',
  },
  actionTitleDanger: {
    color: COLORS.error,
  },
  actionSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
});
