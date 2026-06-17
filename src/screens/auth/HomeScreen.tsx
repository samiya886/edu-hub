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

  const featuredNote = notes[0];
  const featuredPaper = papers[0];

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
          <Ionicons name="library-outline" size={14} color={COLORS.text} />
          <Text style={styles.navChipText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navChip} onPress={() => navigation.navigate('Browse', { initialTab: 'papers' })}>
          <Ionicons name="document-text-outline" size={14} color={COLORS.text} />
          <Text style={styles.navChipText}>Papers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navChip} onPress={() => navigation.navigate('Departments')}>
          <Ionicons name="business-outline" size={14} color={COLORS.text} />
          <Text style={styles.navChipText}>Departments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>Student workspace</Text>
        <Text style={styles.title}>Find study material without opening a website.</Text>
        <Text style={styles.subtitle}>
          Search live notes, papers, departments, and courses in a compact app-first home.
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

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.sectionTitle}>Live picks</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Browse')}>
            <Text style={styles.sectionLink}>Open library</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickGrid}>
          <TouchableOpacity
            style={styles.pickCard}
            onPress={() => featuredNote
              ? navigation.navigate('PDFViewer', { title: featuredNote.title, url: featuredNote.fileUrl })
              : navigation.navigate('Browse', { initialTab: 'notes' })}
            activeOpacity={0.82}
          >
            <View style={styles.pickIcon}>
              <Ionicons name="reader-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.pickLabel}>Note</Text>
            <Text style={styles.pickTitle} numberOfLines={2}>{featuredNote?.title || 'Browse latest notes'}</Text>
            <Text style={styles.pickMeta} numberOfLines={1}>{featuredNote?.subject || 'Updated from EduHub'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickCard}
            onPress={() => featuredPaper
              ? navigation.navigate('PDFViewer', { title: featuredPaper.title, url: featuredPaper.fileUrl })
              : navigation.navigate('Browse', { initialTab: 'papers' })}
            activeOpacity={0.82}
          >
            <View style={styles.pickIcon}>
              <Ionicons name="document-attach-outline" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.pickLabel}>Paper</Text>
            <Text style={styles.pickTitle} numberOfLines={2}>{featuredPaper?.title || 'Browse question papers'}</Text>
            <Text style={styles.pickMeta} numberOfLines={1}>{featuredPaper?.subject || 'Exam prep library'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View>
            <Text style={styles.footerBrand}>EduHub</Text>
            <Text style={styles.footerText}>Built for quick academic access.</Text>
          </View>
          <View style={styles.footerSeal}>
            <Ionicons name="sparkles-outline" size={18} color={COLORS.primary} />
          </View>
        </View>
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Departments')}>
            <Text style={styles.footerLinkText}>Catalog</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLinkText}>Role Login</Text>
          </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 58 : 36,
    paddingHorizontal: 16,
    paddingBottom: 22,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    marginTop: 22,
    gap: 14,
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
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
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
    marginTop: 22,
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
    fontSize: 17,
    fontWeight: '900',
  },
  sectionLink: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  panel: {
    marginTop: 22,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pickGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  pickCard: {
    flex: 1,
    minHeight: 142,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 14,
    ...SHADOWS.card,
  },
  pickIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warningBg,
  },
  pickLabel: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  pickTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 6,
  },
  pickMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    borderRadius: 8,
    padding: 16,
    backgroundColor: COLORS.brandDark,
  },
  footerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerBrand: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
  },
  footerText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
  footerSeal: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  footerLink: {
    minHeight: 36,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  footerLinkText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
  },
});
