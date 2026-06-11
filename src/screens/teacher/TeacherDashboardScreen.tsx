import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { statsService, notesService, papersService, TeacherStats, Note, Paper } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { StatCard } from '../../components/StatCard';

export default function TeacherDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [myNotes, setMyNotes] = useState<Note[]>([]);
  const [myPapers, setMyPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [tStats, notesList, papersList] = await Promise.all([
        statsService.getTeacherStats().catch(() => getMockStats()),
        notesService.list().catch(() => getMockNotes()),
        papersService.list().catch(() => getMockPapers()),
      ]);

      setStats(tStats);
      // Filter materials uploaded by current user
      const currentUserId = user?.id || '';
      setMyNotes(notesList.filter(n => n.uploadedBy.id === currentUserId || n.id.startsWith('mock')));
      setMyPapers(papersList.filter(p => p.uploadedBy.id === currentUserId || p.id.startsWith('mock')));
    } catch (err) {
      console.error('Error loading teacher stats', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = (id: string, type: 'note' | 'paper') => {
    Alert.alert('Delete Material', 'Are you sure you want to permanently delete this resource?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            if (type === 'note') {
              await notesService.delete(id).catch(() => {});
              setMyNotes(prev => prev.filter(n => n.id !== id));
            } else {
              await papersService.delete(id).catch(() => {});
              setMyPapers(prev => prev.filter(p => p.id !== id));
            }
            Alert.alert('Success', 'Resource deleted successfully.');
            fetchData();
          } catch {
            Alert.alert('Error', 'Failed to delete resource');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const getMockStats = (): TeacherStats => ({
    totalNotes: 8,
    totalPapers: 5,
    totalDownloads: 184,
    recentUploads: [
      { id: 'mock-n1', title: 'Intro to Computer Networks', type: 'note', downloads: 12 },
      { id: 'mock-p1', title: 'Calculus Midterm 2025', type: 'paper', downloads: 45 },
    ]
  });

  const getMockNotes = (): Note[] => [
    {
      id: 'mock-n1',
      title: 'Intro to Computer Networks',
      subject: 'Computer Networks',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: { id: user?.id || 't1', name: user?.name || 'Dr. Jenkins' },
      downloadsCount: 12,
      createdAt: new Date().toISOString(),
    }
  ];

  const getMockPapers = (): Paper[] => [
    {
      id: 'mock-p1',
      title: 'Advanced Calculus 2025 Midterm',
      subject: 'Mathematics',
      year: 2025,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: { id: user?.id || 't1', name: user?.name || 'Dr. Jenkins' },
      downloadsCount: 45,
      createdAt: new Date().toISOString(),
    }
  ];

  if (loading) return <Loader fullScreen message="Loading Dashboard..." />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.kicker}>Faculty workspace</Text>
        <Text style={styles.helloText}>Welcome, {user?.name}</Text>
        <Text style={styles.subText}>Publish resources, monitor downloads, and keep academic content current.</Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.statsRow}>
        <StatCard icon="document-text-outline" value={stats?.totalNotes || 0} label="Notes" />
        <StatCard icon="journal-outline" value={stats?.totalPapers || 0} label="Papers" />
        <StatCard icon="download-outline" value={stats?.totalDownloads || 0} label="Downloads" />
      </View>

      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => navigation.navigate('Upload')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={20} color={COLORS.white} />
        <Text style={styles.actionBtnText}>Upload New Material</Text>
      </TouchableOpacity>

      {/* My Notes list */}
      <Text style={styles.sectionTitle}>My Notes</Text>
      {myNotes.length === 0 ? (
        <EmptyState title="No notes uploaded yet" message="Upload notes to share with your students." />
      ) : (
        myNotes.map((note) => (
          <Card
            key={note.id}
            title={note.title}
            headerRight={
              <View style={styles.cardHeaderActions}>
                <TouchableOpacity onPress={() => navigation.navigate('Upload', { editItem: note, type: 'note' })} style={styles.actionIcon}>
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(note.id, 'note')} style={styles.actionIcon}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            }
          >
            <View style={styles.cardInfo}>
              <Text style={styles.infoText}>Subject: {note.subject}</Text>
              <Text style={styles.infoText}>Downloads: {note.downloadsCount}</Text>
            </View>
          </Card>
        ))
      )}

      {/* My Papers list */}
      <Text style={styles.sectionTitle}>My Papers</Text>
      {myPapers.length === 0 ? (
        <EmptyState title="No papers uploaded yet" message="Upload previous year questions." />
      ) : (
        myPapers.map((paper) => (
          <Card
            key={paper.id}
            title={paper.title}
            headerRight={
              <View style={styles.cardHeaderActions}>
                <TouchableOpacity onPress={() => navigation.navigate('Upload', { editItem: paper, type: 'paper' })} style={styles.actionIcon}>
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(paper.id, 'paper')} style={styles.actionIcon}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            }
          >
            <View style={styles.cardInfo}>
              <Text style={styles.infoText}>Subject: {paper.subject}</Text>
              <Text style={styles.infoText}>Year: {paper.year}</Text>
              <Text style={styles.infoText}>Downloads: {paper.downloadsCount}</Text>
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
    lineHeight: 21,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  actionBtn: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 12,
  },
  cardHeaderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIcon: {
    padding: 4,
  },
  cardInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
