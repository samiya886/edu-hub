import React, { useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Note, Paper, notesService, papersService } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { SearchBar } from '../../components/SearchBar';
import { StatCard } from '../../components/StatCard';

type MaterialType = 'note' | 'paper';
type TeacherMaterial = { type: MaterialType; item: Note | Paper };

function getUploaderIdentity(item: Note | Paper) {
  const uploadedBy = item.uploadedBy as { id?: string; _id?: string; name?: string } | undefined;

  return {
    id: uploadedBy?.id || uploadedBy?._id || '',
    name: uploadedBy?.name || '',
  };
}

function isTeacherMaterial(item: Note | Paper, userId?: string, userName?: string) {
  const uploader = getUploaderIdentity(item);

  return Boolean(
    (userId && uploader.id && uploader.id === userId) ||
      (userName && uploader.name && uploader.name.trim().toLowerCase() === userName.trim().toLowerCase()),
  );
}

function matchesSearch(item: Note | Paper, search: string) {
  const value = search.trim().toLowerCase();
  if (!value) return true;

  return [item.title, item.subject, item.course, item.department]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(value));
}

function sortByNewest(a: TeacherMaterial, b: TeacherMaterial) {
  return new Date(b.item.createdAt || 0).getTime() - new Date(a.item.createdAt || 0).getTime();
}

function MaterialCard({
  item,
  type,
  onView,
  onEdit,
  onDelete,
}: {
  item: Note | Paper;
  type: MaterialType;
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
        <View style={styles.infoRow}>
          <Ionicons name={isPaper ? 'calendar-outline' : 'bookmark-outline'} size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{isPaper ? `Year: ${'year' in item ? item.year : ''}` : item.subject}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{item.course || item.department || 'General'}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.openIconButton} onPress={onView} accessibilityLabel="Open">
          <Ionicons name="eye-outline" size={17} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editIconButton} onPress={onEdit} accessibilityLabel="Edit">
          <Ionicons name="create-outline" size={17} color={COLORS.brand} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteIconButton} onPress={onDelete} accessibilityLabel="Delete">
          <Ionicons name="trash-outline" size={17} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function TeacherDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const [notesList, papersList] = await Promise.all([notesService.list(), papersService.list()]);
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

  const myNotes = useMemo(
    () => notes.filter((note) => isTeacherMaterial(note, user?.id, user?.name)),
    [notes, user?.id, user?.name],
  );
  const myPapers = useMemo(
    () => papers.filter((paper) => isTeacherMaterial(paper, user?.id, user?.name)),
    [papers, user?.id, user?.name],
  );
  const searchedNotes = useMemo(() => myNotes.filter((note) => matchesSearch(note, search)), [myNotes, search]);
  const searchedPapers = useMemo(() => myPapers.filter((paper) => matchesSearch(paper, search)), [myPapers, search]);
  const recentUploads = useMemo(
    () => [
      ...searchedNotes.map((item) => ({ type: 'note' as const, item })),
      ...searchedPapers.map((item) => ({ type: 'paper' as const, item })),
    ].sort(sortByNewest).slice(0, 3),
    [searchedNotes, searchedPapers],
  );
  const totalDownloads = useMemo(
    () => [...myNotes, ...myPapers].reduce((total, item) => total + item.downloadsCount, 0),
    [myNotes, myPapers],
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
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

  const renderMaterialCard = ({ type, item }: TeacherMaterial) => (
    <MaterialCard
      key={`${type}-${item.id}`}
      item={item}
      type={type}
      onView={() => navigation.navigate('PDFViewer', { title: item.title, url: item.fileUrl })}
      onEdit={() => navigation.navigate('Upload', { editItem: item, type })}
      onDelete={() => handleDelete(item.id, type)}
    />
  );

  if (loading) return <Loader fullScreen message="Loading Teacher Dashboard..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.kicker}>Teacher portal</Text>
        <Text style={styles.helloText}>Hello, {user?.name || 'Teacher'}</Text>
        <Text style={styles.subText}>Manage your uploaded notes, exam papers, and student-ready resources.</Text>
        <View style={styles.heroStats}>
          <Text style={styles.heroStat}>{myNotes.length + myPapers.length} uploads</Text>
          <Text style={styles.heroStat}>{totalDownloads} downloads</Text>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search your notes, papers, subjects..."
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.statsRow}>
        <StatCard icon="document-text-outline" value={myNotes.length} label="My Notes" />
        <StatCard icon="journal-outline" value={myPapers.length} label="My Papers" />
        <StatCard icon="download-outline" value={totalDownloads} label="Downloads" />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Upload')} activeOpacity={0.8}>
          <View style={styles.iconBox}>
            <Ionicons name="cloud-upload" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.gridText}>Upload Resource</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={onRefresh} activeOpacity={0.8}>
          <View style={styles.iconBox}>
            <Ionicons name="refresh" size={24} color={COLORS.teal} />
          </View>
          <Text style={styles.gridText}>Refresh Dashboard</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Uploads</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.seeAllText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {recentUploads.length === 0 ? (
        <EmptyState title="No recent uploads" message="Upload notes or papers to see them here." />
      ) : (
        recentUploads.map(renderMaterialCard)
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Notes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Upload', { type: 'note' })}>
          <Text style={styles.seeAllText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      {searchedNotes.length === 0 ? (
        <EmptyState title="No notes found" message="Upload notes from your teacher account to list them here." />
      ) : (
        searchedNotes.slice(0, 3).map((note) => renderMaterialCard({ type: 'note', item: note }))
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Papers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Upload', { type: 'paper' })}>
          <Text style={styles.seeAllText}>Add Paper</Text>
        </TouchableOpacity>
      </View>

      {searchedPapers.length === 0 ? (
        <EmptyState title="No papers found" message="Upload exam papers from your teacher account to list them here." />
      ) : (
        searchedPapers.slice(0, 3).map((paper) => renderMaterialCard({ type: 'paper', item: paper }))
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
    marginTop: 14,
    marginBottom: 20,
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
    marginTop: 14,
    marginBottom: 0,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
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
    textAlign: 'center',
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
    gap: 8,
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
  editIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
