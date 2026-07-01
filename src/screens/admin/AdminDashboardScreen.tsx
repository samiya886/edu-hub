import React, { useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AdminAnalytics, Note, Paper, notesService, papersService, statsService } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { SearchBar } from '../../components/SearchBar';
import { StatCard } from '../../components/StatCard';

type MaterialType = 'note' | 'paper';
type AdminMaterial = { type: MaterialType; item: Note | Paper };
type ContentFilter = 'all' | 'notes' | 'papers';

const PAGE_SIZE = 5;

function matchesSearch(item: Note | Paper, search: string) {
  const value = search.trim().toLowerCase();
  if (!value) return true;

  return [item.title, item.subject, item.course, item.department, item.uploadedBy?.name]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(value));
}

function sortByNewest(a: AdminMaterial, b: AdminMaterial) {
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
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>By {item.uploadedBy?.name || 'Unknown'}</Text>
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

export default function AdminDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ContentFilter>('all');
  const [page, setPage] = useState(1);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const [analyticsData, notesList, papersList] = await Promise.all([
        statsService.getAdminAnalytics(),
        notesService.list(),
        papersService.list(),
      ]);
      setAnalytics(analyticsData);
      setNotes(notesList);
      setPapers(papersList);
    } catch (err: any) {
      console.error('Error loading admin dashboard', err);
      setError(err.response?.data?.message || err.message || 'Unable to load admin dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const allMaterials = useMemo(
    () => [
      ...notes.map((item) => ({ type: 'note' as const, item })),
      ...papers.map((item) => ({ type: 'paper' as const, item })),
    ].sort(sortByNewest),
    [notes, papers],
  );

  const filteredMaterials = useMemo(
    () => allMaterials.filter(({ type, item }) => {
      const typeMatches = filter === 'all' || (filter === 'notes' && type === 'note') || (filter === 'papers' && type === 'paper');
      return typeMatches && matchesSearch(item, search);
    }),
    [allMaterials, filter, search],
  );

  const recentUploads = useMemo(() => filteredMaterials.slice(0, 3), [filteredMaterials]);
  const totalDownloads = useMemo(
    () => allMaterials.reduce((total, { item }) => total + item.downloadsCount, 0),
    [allMaterials],
  );
  const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / PAGE_SIZE));
  const pagedMaterials = useMemo(
    () => filteredMaterials.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredMaterials, page],
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = (id: string, type: MaterialType) => {
    Alert.alert('Delete Material', 'Are you sure you want to permanently delete this resource from the platform?', [
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
            console.error('Failed to delete admin resource', err);
            Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to delete resource');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderMaterialCard = ({ type, item }: AdminMaterial) => (
    <MaterialCard
      key={`${type}-${item.id}`}
      item={item}
      type={type}
      onView={() => navigation.navigate('PDFViewer', { title: item.title, url: item.fileUrl })}
      onEdit={() => navigation.navigate('Upload', { editItem: item, type })}
      onDelete={() => handleDelete(item.id, type)}
    />
  );

  if (loading) return <Loader fullScreen message="Loading Admin Dashboard..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.kicker}>Admin portal</Text>
        <Text style={styles.helloText}>Hello, {user?.name || 'Admin'}</Text>
        <Text style={styles.subText}>Manage every note, exam paper, user, catalog item, and platform resource.</Text>
        <View style={styles.heroStats}>
          <Text style={styles.heroStat}>{allMaterials.length} resources</Text>
          <Text style={styles.heroStat}>{analytics?.usersCount.total || 0} users</Text>
          <Text style={styles.heroStat}>{totalDownloads} downloads</Text>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search notes, papers, uploaders, subjects..."
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.statsRow}>
        <StatCard icon="document-text-outline" value={notes.length} label="Notes" />
        <StatCard icon="journal-outline" value={papers.length} label="Papers" />
        <StatCard icon="people-outline" value={analytics?.usersCount.total || 0} label="Users" />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Upload')} activeOpacity={0.8}>
          <View style={styles.iconBox}>
            <Ionicons name="cloud-upload" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.gridText}>Upload Resource</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridBtn} onPress={() => navigation.navigate('Users')} activeOpacity={0.8}>
          <View style={styles.iconBox}>
            <Ionicons name="people-outline" size={24} color={COLORS.teal} />
          </View>
          <Text style={styles.gridText}>Manage Users</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {([
          ['all', 'All'],
          ['notes', 'Notes'],
          ['papers', 'Papers'],
        ] as const).map(([value, label]) => (
          <TouchableOpacity
            key={value}
            style={[styles.filterChip, filter === value && styles.activeFilterChip]}
            onPress={() => setFilter(value)}
            activeOpacity={0.82}
          >
            <Text style={[styles.filterText, filter === value && styles.activeFilterText]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Uploads</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.seeAllText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {recentUploads.length === 0 ? (
        <EmptyState title="No recent uploads" message="No matching notes or papers were found." />
      ) : (
        recentUploads.map(renderMaterialCard)
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All Content</Text>
        <Text style={styles.countText}>{filteredMaterials.length} items</Text>
      </View>

      {pagedMaterials.length === 0 ? (
        <EmptyState title="No content found" message="Try another search or filter." />
      ) : (
        pagedMaterials.map(renderMaterialCard)
      )}

      <View style={styles.paginationRow}>
        <TouchableOpacity
          style={[styles.pageButton, page <= 1 && styles.disabledPageButton]}
          onPress={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page <= 1}
        >
          <Ionicons name="chevron-back" size={16} color={page <= 1 ? COLORS.muted : COLORS.text} />
          <Text style={[styles.pageButtonText, page <= 1 && styles.disabledPageText]}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>Page {page} of {totalPages}</Text>
        <TouchableOpacity
          style={[styles.pageButton, page >= totalPages && styles.disabledPageButton]}
          onPress={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={page >= totalPages}
        >
          <Text style={[styles.pageButtonText, page >= totalPages && styles.disabledPageText]}>Next</Text>
          <Ionicons name="chevron-forward" size={16} color={page >= totalPages ? COLORS.muted : COLORS.text} />
        </TouchableOpacity>
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
    marginBottom: 20,
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterChip: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.warningBg,
  },
  filterText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '900',
  },
  activeFilterText: {
    color: COLORS.primaryDark,
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
  countText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
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
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  pageButton: {
    minHeight: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  disabledPageButton: {
    opacity: 0.48,
  },
  pageButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  disabledPageText: {
    color: COLORS.muted,
  },
  pageText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
});