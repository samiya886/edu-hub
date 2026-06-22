import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { notesService, papersService, Note, Paper } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { SearchBar } from '../../components/SearchBar';

export default function StudentDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [recentPapers, setRecentPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const [notes, papers] = await Promise.all([
        notesService.list(),
        papersService.list(),
      ]);
      setRecentNotes(notes.slice(0, 3));
      setRecentPapers(papers.slice(0, 3));
    } catch (err: any) {
      console.error('Error loading student dashboard', err);
      setError(err.response?.data?.message || err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = () => {
    navigation.navigate('NotesPapers', { searchQuery: search });
  };

  if (loading) return <Loader fullScreen message="Loading Dashboard..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      {/* Header Welcome */}
      <View style={styles.welcomeSection}>
        <Text style={styles.kicker}>Student portal</Text>
        <Text style={styles.helloText}>Hello, {user?.name || 'Student'}</Text>
        <Text style={styles.subText}>Find verified notes, previous year papers, and course-ready resources.</Text>
        <View style={styles.heroStats}>
          <Text style={styles.heroStat}>50k+ learners</Text>
          <Text style={styles.heroStat}>98% success rate</Text>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearch}
        placeholder="Search notes, subjects, papers..."
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('NotesPapers')} activeOpacity={0.8}>
          <View style={styles.iconBox}>
            <Ionicons name="book" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.gridText}>Browse Materials</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Upload')} activeOpacity={0.8}>
          <View style={styles.iconBox}>
            <Ionicons name="cloud-upload" size={24} color={COLORS.teal} />
          </View>
          <Text style={styles.gridText}>Upload Resource</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Notes Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Notes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NotesPapers', { initialTab: 'notes' })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {recentNotes.length === 0 ? (
        <EmptyState title="No recent notes" message="Be the first to upload one!" />
      ) : (
        recentNotes.map((note) => (
          <Card
            key={note.id}
            title={note.title}
            headerRight={
              <View style={styles.downloadsBadge}>
                <Ionicons name="download-outline" size={12} color={COLORS.primary} />
                <Text style={styles.downloadsText}>{note.downloadsCount}</Text>
              </View>
            }
          >
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="bookmark-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>{note.subject}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>By {note.uploadedBy.name}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.openIconButton}
                onPress={() => navigation.navigate('PDFViewer', { title: note.title, url: note.fileUrl })}
                accessibilityLabel="Open"
              >
                <Ionicons name="eye-outline" size={17} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}

      {/* Recent Papers Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Papers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NotesPapers', { initialTab: 'papers' })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {recentPapers.length === 0 ? (
        <EmptyState title="No recent papers" message="Upload exam question papers here!" />
      ) : (
        recentPapers.map((paper) => (
          <Card
            key={paper.id}
            title={paper.title}
            headerRight={
              <View style={styles.downloadsBadge}>
                <Ionicons name="download-outline" size={12} color={COLORS.primary} />
                <Text style={styles.downloadsText}>{paper.downloadsCount}</Text>
              </View>
            }
          >
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>Year: {paper.year}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="bookmark-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>{paper.subject}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.openIconButton}
                onPress={() => navigation.navigate('PDFViewer', { title: paper.title, url: paper.fileUrl })}
                accessibilityLabel="Open"
              >
                <Ionicons name="eye-outline" size={17} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}
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
    marginBottom: 16,
    marginTop: 8,
    padding: 22,
    borderRadius: 30,
    backgroundColor: COLORS.brand,
    overflow: 'hidden',
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
    lineHeight: 21,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  heroStat: {
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  seeAllText: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: '600',
  },
  gridContainer: {
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
    padding: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: COLORS.warningBg,
  },
  gridText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
  },
  downloadsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  downloadsText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  cardInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 12,
    marginTop: 4,
  },
  openIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

