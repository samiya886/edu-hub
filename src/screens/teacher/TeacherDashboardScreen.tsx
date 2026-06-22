import React, { useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Note, Paper, TeacherStats, notesService, papersService, statsService } from '../../services/api';
import { COLORS, SHADOWS } from '../../constants';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { SearchBar } from '../../components/SearchBar';
import { StatCard } from '../../components/StatCard';

type MaterialType = 'note' | 'paper';

function QuickAction({
  icon,
  title,
  subtitle,
  tone = 'primary',
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  tone?: 'primary' | 'teal' | 'brand';
  onPress: () => void;
}) {
  const color = tone === 'teal' ? COLORS.teal : tone === 'brand' ? COLORS.brand : COLORS.primary;

  return (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.84} onPress={onPress}>
      <View style={[styles.quickIcon, { backgroundColor: tone === 'brand' ? COLORS.successBg : COLORS.warningBg }]}>
        <Ionicons name={icon} size={21} color={color} />
      </View>
      <View style={styles.quickCopy}>
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

function MaterialCard({
  item,
  type,
  owned,
  onView,
  onEdit,
  onDelete,
}: {
  item: Note | Paper;
  type: MaterialType;
  owned: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isPaper = type === 'paper';

  return (
    <Card
      title={item.title}
      headerRight={
        <View style={styles.downloadsBadge}>
          <Ionicons name="download-outline" size={12} color={COLORS.primary} />
          <Text style={styles.downloadsText}>{item.downloadsCount}</Text>
        </View>
      }
    >
      <View style={styles.cardInfo}>
        <View style={styles.infoPill}>
          <Ionicons name={isPaper ? 'calendar-outline' : 'bookmark-outline'} size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{isPaper ? `Year ${'year' in item ? item.year : ''}` : item.subject}</Text>
        </View>
        <View style={styles.infoPill}>
          <Ionicons name="school-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{item.course || item.department || 'General'}</Text>
        </View>
        {!owned ? (
          <View style={styles.infoPill}>
            <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>By {item.uploadedBy.name}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.iconButtonOpen}
          activeOpacity={0.84}
          onPress={onView}
          accessibilityLabel="Open"
        >
          <Ionicons name="eye-outline" size={17} color={COLORS.primary} />
        </TouchableOpacity>

        {owned ? (
          <>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.84} onPress={onEdit}>
              <Ionicons name="create-outline" size={17} color={COLORS.brand} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButtonDanger} activeOpacity={0.84} onPress={onDelete}>
              <Ionicons name="trash-outline" size={17} color={COLORS.error} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </Card>
  );
}

export default function TeacherDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const [teacherStats, notesList, papersList] = await Promise.all([
        statsService.getTeacherStats(),
        notesService.list(),
        papersService.list(),
      ]);

      setStats(teacherStats);
      setNotes(notesList);
      setPapers(papersList);
    } catch (err: any) {
      console.error('Error loading teacher dashboard', err);
      setError(err.response?.data?.message || err.message || 'Unable to load teacher dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentUserId = user?.id || '';
  const myNotes = useMemo(
    () => notes.filter((note) => note.uploadedBy.id === currentUserId || note.uploadedBy.name === user?.name),
    [currentUserId, notes, user?.name],
  );
  const myPapers = useMemo(
    () => papers.filter((paper) => paper.uploadedBy.id === currentUserId || paper.uploadedBy.name === user?.name),
    [currentUserId, papers, user?.name],
  );
  const displayedNotes = myNotes.length > 0 ? myNotes.slice(0, 3) : notes.slice(0, 3);
  const displayedPapers = myPapers.length > 0 ? myPapers.slice(0, 3) : papers.slice(0, 3);
  const totalOwned = myNotes.length + myPapers.length;
  const ownedDownloads = [...myNotes, ...myPapers].reduce((total, item) => total + item.downloadsCount, 0);
  const latestUploads = stats?.recentUploads?.slice(0, 4) || [];

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = () => {
    navigation.navigate('NotesPapers', { searchQuery: search });
  };

  const handleDelete = (id: string, type: MaterialType) => {
    Alert.alert('Delete Material', 'Are you sure you want to permanently delete this resource?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            if (type === 'note') {
              await notesService.delete(id);
              setNotes((prev) => prev.filter((note) => note.id !== id));
            } else {
              await papersService.delete(id);
              setPapers((prev) => prev.filter((paper) => paper.id !== id));
            }
            Alert.alert('Deleted', 'Resource deleted successfully.');
            fetchData();
          } catch (err: any) {
            console.error('Failed to delete teacher resource', err);
            Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to delete resource');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) return <Loader fullScreen message="Loading Teacher Dashboard..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.kicker}>Faculty workspace</Text>
        <Text style={styles.helloText}>Welcome, {user?.name || 'Teacher'}</Text>
        <Text style={styles.subText}>Publish resources, monitor downloads, and keep academic content current.</Text>
        <View style={styles.heroStats}>
          <Text style={styles.heroStat}>{totalOwned} owned uploads</Text>
          <Text style={styles.heroStat}>{ownedDownloads} downloads</Text>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        onSubmit={handleSearch}
        placeholder="Search notes, papers, subjects..."
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.statsRow}>
        <StatCard icon="document-text-outline" value={myNotes.length || stats?.totalNotes || 0} label="Notes" />
        <StatCard icon="journal-outline" value={myPapers.length || stats?.totalPapers || 0} label="Papers" />
        <StatCard icon="download-outline" value={ownedDownloads || stats?.totalDownloads || 0} label="Downloads" />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickGrid}>
        <QuickAction
          icon="cloud-upload-outline"
          title="Upload"
          subtitle="Add notes or papers"
          onPress={() => navigation.navigate('Upload')}
        />
        <QuickAction
          icon="library-outline"
          title="Library"
          subtitle="Review resources"
          tone="brand"
          onPress={() => navigation.navigate('NotesPapers')}
        />
        <QuickAction
          icon="business-outline"
          title="Catalog"
          subtitle="Courses and subjects"
          tone="teal"
          onPress={() => navigation.navigate('Catalog')}
        />
      </View>

      <View style={styles.panel}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleInline}>Recent Activity</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text style={styles.seeAllText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {latestUploads.length === 0 ? (
          <EmptyState title="No activity yet" message="Uploaded resources will appear here." />
        ) : (
          latestUploads.map((upload) => (
            <View key={`${upload.type}-${upload.id}`} style={styles.activityRow}>
              <View style={styles.activityIcon}>
                <Ionicons name={upload.type === 'note' ? 'reader-outline' : 'document-text-outline'} size={16} color={COLORS.primary} />
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityTitle} numberOfLines={1}>{upload.title}</Text>
                <Text style={styles.activityMeta}>{upload.type === 'note' ? 'Note' : 'Paper'} • {upload.downloads} downloads</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleInline}>{myNotes.length > 0 ? 'My Notes' : 'Recent Notes'}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NotesPapers', { initialTab: 'notes' })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {displayedNotes.length === 0 ? (
        <EmptyState title="No notes available" message="Upload notes to share with your students." />
      ) : (
        displayedNotes.map((note) => {
          const owned = myNotes.some((item) => item.id === note.id);
          return (
            <MaterialCard
              key={note.id}
              item={note}
              type="note"
              owned={owned}
              onView={() => navigation.navigate('PDFViewer', { title: note.title, url: note.fileUrl })}
              onEdit={() => navigation.navigate('Upload', { editItem: note, type: 'note' })}
              onDelete={() => handleDelete(note.id, 'note')}
            />
          );
        })
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitleInline}>{myPapers.length > 0 ? 'My Papers' : 'Recent Papers'}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('NotesPapers', { initialTab: 'papers' })}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {displayedPapers.length === 0 ? (
        <EmptyState title="No papers available" message="Upload exam papers to support your students." />
      ) : (
        displayedPapers.map((paper) => {
          const owned = myPapers.some((item) => item.id === paper.id);
          return (
            <MaterialCard
              key={paper.id}
              item={paper}
              type="paper"
              owned={owned}
              onView={() => navigation.navigate('PDFViewer', { title: paper.title, url: paper.fileUrl })}
              onEdit={() => navigation.navigate('Upload', { editItem: paper, type: 'paper' })}
              onDelete={() => handleDelete(paper.id, 'paper')}
            />
          );
        })
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
    ...SHADOWS.card,
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
    flexWrap: 'wrap',
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
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionTitleInline: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
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
  quickGrid: {
    gap: 10,
    marginBottom: 20,
  },
  quickAction: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    ...SHADOWS.card,
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickCopy: {
    flex: 1,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  quickSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  panel: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.card,
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
    fontWeight: '800',
  },
  activityRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceMuted,
  },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityCopy: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
  },
  activityMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
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
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  cardInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  infoPill: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    paddingTop: 12,
    marginTop: 4,
  },
  iconButtonOpen: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDanger: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

