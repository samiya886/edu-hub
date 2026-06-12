import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../components/Button';
import { COLORS, SHADOWS } from '../../constants';

type HomeScreenProps = {
  navigation: {
    navigate: (screen: 'Login' | 'Signup') => void;
  };
};

const highlights = [
  { icon: 'library-outline', label: 'Verified Notes', value: 'Curated study material' },
  { icon: 'document-text-outline', label: 'Question Papers', value: 'Previous year resources' },
  { icon: 'people-outline', label: 'Role Dashboards', value: 'Student, teacher, admin' },
] as const;

const stats = [
  { value: '24/7', label: 'Access' },
  { value: '3', label: 'Roles' },
  { value: '1', label: 'Study Hub' },
] as const;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Ionicons name="school" size={23} color={COLORS.white} />
          </View>
          <Text style={styles.brand}>EduHub<Text style={styles.brandDot}>.</Text></Text>
        </View>
        <TouchableOpacity
          style={styles.loginPill}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.75}
        >
          <Ionicons name="log-in-outline" size={17} color={COLORS.primary} />
          <Text style={styles.loginPillText}>Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>Academic resource platform</Text>
        <Text style={styles.title}>Learn smarter with notes, papers, and dashboards in one place.</Text>
        <Text style={styles.subtitle}>
          EduHub connects students and teachers with organized study resources, uploads, alerts, and role-based tools.
        </Text>

        <View style={styles.actions}>
          <Button
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            style={styles.primaryAction}
          />
          <Button
            title="Sign In"
            variant="outline"
            onPress={() => navigation.navigate('Login')}
            style={styles.secondaryAction}
          />
        </View>
      </View>

      <View style={styles.previewPanel}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelEyebrow}>Today</Text>
            <Text style={styles.panelTitle}>Student Workspace</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Live</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statItem}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Resource readiness</Text>
            <Text style={styles.progressPercent}>86%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>

      <View style={styles.highlights}>
        {highlights.map((item) => (
          <View key={item.label} style={styles.highlightCard}>
            <View style={styles.highlightIcon}>
              <Ionicons name={item.icon} size={21} color={COLORS.primary} />
            </View>
            <View style={styles.highlightCopy}>
              <Text style={styles.highlightLabel}>{item.label}</Text>
              <Text style={styles.highlightValue}>{item.value}</Text>
            </View>
          </View>
        ))}
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
    paddingTop: Platform.OS === 'ios' ? 58 : 36,
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  topBar: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    ...SHADOWS.lift,
  },
  brand: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandDot: {
    color: COLORS.primary,
  },
  loginPill: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  loginPillText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  hero: {
    paddingTop: 42,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: COLORS.textDark,
    fontSize: 37,
    lineHeight: 43,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 26,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
  previewPanel: {
    marginTop: 34,
    borderRadius: 8,
    padding: 18,
    backgroundColor: COLORS.brand,
    ...SHADOWS.card,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  panelEyebrow: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  panelTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  statItem: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: 'rgba(204,251,241,0.74)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  progressBlock: {
    marginTop: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  progressPercent: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  progressFill: {
    width: '86%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  highlights: {
    gap: 12,
    marginTop: 18,
  },
  highlightCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warningBg,
  },
  highlightCopy: {
    flex: 1,
  },
  highlightLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },
  highlightValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
});
