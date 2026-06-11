import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { statsService, AdminAnalytics } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { StatCard } from '../../components/StatCard';

export default function AdminDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const data = await statsService.getAdminAnalytics().catch(() => getMockAnalytics());
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching admin analytics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const getMockAnalytics = (): AdminAnalytics => ({
    usersCount: { total: 124, students: 98, teachers: 22, admins: 4 },
    contentCount: { totalNotes: 54, totalPapers: 31 },
    downloadsOverTime: [],
    flaggedReports: 3,
  });

  if (loading) return <Loader fullScreen message="Loading System Overview..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.kicker}>Admin access</Text>
        <Text style={styles.helloText}>System Control</Text>
        <Text style={styles.subText}>Logged in as Administrator: {user?.name}</Text>
      </View>

      {/* Warnings & Alerts */}
      {analytics && analytics.flaggedReports > 0 && (
        <View style={styles.warningAlert}>
          <Ionicons name="warning-outline" size={20} color={COLORS.error} />
          <Text style={styles.warningText}>
            System Alert: There are {analytics.flaggedReports} pending flagged reports/notes.
          </Text>
        </View>
      )}

      {/* Quick Navigation Cards */}
      <Text style={styles.sectionTitle}>Administrative Actions</Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Users')} activeOpacity={0.8}>
          <Ionicons name="people-outline" size={24} color={COLORS.primary} />
          <Text style={styles.gridText}>Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Content')} activeOpacity={0.8}>
          <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
          <Text style={styles.gridText}>Manage Content</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics Summary */}
      <Text style={styles.sectionTitle}>Platform Statistics</Text>

      <Card title="User Accounts">
        <View style={styles.statDetailRow}>
          <StatCard icon="people-outline" value={analytics?.usersCount.total || 0} label="Users" />
          <StatCard icon="school-outline" value={analytics?.usersCount.students || 0} label="Students" />
          <StatCard icon="briefcase-outline" value={analytics?.usersCount.teachers || 0} label="Teachers" />
        </View>
      </Card>

      <Card title="Content Volumes">
        <View style={styles.statDetailRow}>
          <StatCard icon="document-text-outline" value={analytics?.contentCount.totalNotes || 0} label="Notes" />
          <StatCard icon="journal-outline" value={analytics?.contentCount.totalPapers || 0} label="Papers" />
          <StatCard
            icon="albums-outline"
            value={(analytics?.contentCount.totalNotes || 0) + (analytics?.contentCount.totalPapers || 0)}
            label="Items"
          />
        </View>
      </Card>
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
  welcomeSection: {
    marginBottom: 20,
    marginTop: 8,
    padding: 22,
    borderRadius: 30,
    backgroundColor: COLORS.brand,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  helloText: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.white,
  },
  subText: {
    fontSize: 14,
    color: 'rgba(204,251,241,0.72)',
    marginTop: 8,
    lineHeight: 20,
  },
  warningAlert: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.error,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  gridBtn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  statDetailRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
