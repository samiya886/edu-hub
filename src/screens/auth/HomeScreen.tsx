import React, { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Loader } from '../../components/Loader';
import { SearchBar } from '../../components/SearchBar';
import { COLORS, SHADOWS } from '../../constants';
import { Department, Note, Paper, filterService, notesService, papersService } from '../../services/api';

type PublicRoute = 'Login' | 'Signup' | 'Browse' | 'Departments' | 'PDFViewer';

type HomeScreenProps = {
  navigation: {
    navigate: (screen: PublicRoute, params?: Record<string, unknown>) => void;
  };
};

const roleCards = [
  { role: 'Student', icon: 'school-outline', copy: 'Browse notes, papers, uploads, profile, and saved study resources.' },
  { role: 'Teacher', icon: 'briefcase-outline', copy: 'Upload academic material and manage your published content.' },
  { role: 'Admin', icon: 'key-outline', copy: 'Review users, content, dashboards, and platform-level permissions.' },
] as const;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHomeData = async () => {
    try {
      setError('');
      const [notesList, papersList, departmentsList] = await Promise.all([
        notesService.list(),
        papersService.list(),
        filterService.getDepartments(),
      ]);

      setNotes(notesList);
      setPapers(papersList);
      setDepartments(departmentsList);
    } catch (err: any) {
      console.error('Failed to load home data', err);
      setError(err.response?.data?.message || err.message || 'Unable to load live website data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const totals = useMemo(() => ({
    notes: notes.length,
    papers: papers.length,
    departments: departments.length,
  }), [departments.length, notes.length, papers.length]);

  const latestNotes = notes.slice(0, 3);
  const latestPapers = papers.slice(0, 3);
  const featuredDepartments = departments.slice(0, 4);

  const handleSearch = () => {
    navigation.navigate('Browse', { searchQuery: search });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  if (loading) {
    return <Loader fullScreen message="Loading EduHub..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />}
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

      <View style={styles.navRail}>
        <TouchableOpacity style={styles.navChip} onPress={() => navigation.navigate('Browse', { initialTab: 'notes' })}>
          <Text style={styles.navChipText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navChip} onPress={() => navigation.navigate('Browse', { initialTab: 'papers' })}>
          <Text style={styles.navChipText}>Papers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navChip} onPress={() => navigation.navigate('Departments')}>
          <Text style={styles.navChipText}>Departments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>Academic resource platform</Text>
        <Text style={styles.title}>Notes, question papers, uploads, and dashboards in one mobile app.</Text>
        <Text style={styles.subtitle}>
          Browse the same live EduHub resources, departments, courses, and role dashboards connected to the website database.
        </Text>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          onSubmit={handleSearch}
          placeholder="Search notes, subjects, papers..."
        />

        <View style={styles.actions}>
          <Button
            title="Browse Resources"
            onPress={() => navigation.navigate('Browse', { searchQuery: search })}
            style={styles.primaryAction}
          />
          <Button
            title="Register"
            variant="outline"
            onPress={() => navigation.navigate('Signup')}
            style={styles.secondaryAction}
          />
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totals.notes}</Text>
          <Text style={styles.statLabel}>Notes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totals.papers}</Text>
          <Text style={styles.statLabel}>Papers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totals.departments}</Text>
          <Text style={styles.statLabel}>Departments</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Notes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Browse', { initialTab: 'notes' })}>
          <Text style={styles.sectionLink}>See all</Text>
        </TouchableOpacity>
      </View>

      {latestNotes.length === 0 ? (
        <EmptyState title="No notes found" message="Notes from the website will appear here." />
      ) : latestNotes.map((note) => (
        <Card
          key={note.id}
          title={note.title}
          headerRight={<Text style={styles.cardBadge}>{note.subject}</Text>}
        >
          <Text style={styles.cardMeta}>By {note.uploadedBy.name}</Text>
          <TouchableOpacity
            style={styles.cardAction}
            onPress={() => navigation.navigate('PDFViewer', { title: note.title, url: note.fileUrl })}
          >
            <Text style={styles.cardActionText}>Open Note</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Question Papers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Browse', { initialTab: 'papers' })}>
          <Text style={styles.sectionLink}>See all</Text>
        </TouchableOpacity>
      </View>

      {latestPapers.length === 0 ? (
        <EmptyState title="No papers found" message="Question papers from the website will appear here." icon="document-text-outline" />
      ) : latestPapers.map((paper) => (
        <Card
          key={paper.id}
          title={paper.title}
          headerRight={<Text style={styles.cardBadge}>{paper.year}</Text>}
        >
          <Text style={styles.cardMeta}>{paper.subject}</Text>
          <TouchableOpacity
            style={styles.cardAction}
            onPress={() => navigation.navigate('PDFViewer', { title: paper.title, url: paper.fileUrl })}
          >
            <Text style={styles.cardActionText}>Open Paper</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Departments</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Departments')}>
          <Text style={styles.sectionLink}>Browse catalog</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.departmentGrid}>
        {featuredDepartments.map((department) => (
          <TouchableOpacity
            key={department.id}
            style={styles.departmentCard}
            onPress={() => navigation.navigate('Departments')}
            activeOpacity={0.8}
          >
            <Ionicons name="business-outline" size={18} color={COLORS.primary} />
            <Text style={styles.departmentName}>{department.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Role Dashboards</Text>
      <View style={styles.roleGrid}>
        {roleCards.map((item) => (
          <TouchableOpacity
            key={item.role}
            style={styles.roleCard}
            onPress={() => navigation.navigate(item.role === 'Student' ? 'Signup' : 'Login')}
            activeOpacity={0.8}
          >
            <Ionicons name={item.icon} size={22} color={COLORS.primary} />
            <View style={styles.roleCopy}>
              <Text style={styles.roleTitle}>{item.role}</Text>
              <Text style={styles.roleText}>{item.copy}</Text>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  loginPillText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  navRail: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  navChip: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navChipText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '900',
  },
  hero: {
    marginTop: 24,
    gap: 16,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    color: COLORS.textDark,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAction: {
    flex: 1,
  },
  secondaryAction: {
    flex: 1,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
  },
  statItem: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: COLORS.brand,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: 'rgba(204,251,241,0.74)',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionLink: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  cardBadge: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '900',
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardMeta: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  cardAction: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActionText: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
  departmentGrid: {
    gap: 10,
  },
  departmentCard: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  departmentName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },
  roleGrid: {
    gap: 10,
  },
  roleCard: {
    minHeight: 84,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  roleCopy: {
    flex: 1,
  },
  roleTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },
  roleText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 4,
  },
});
