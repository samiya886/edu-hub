import React, { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { Loader } from '../../components/Loader';
import { COLORS, SHADOWS } from '../../constants';
import {
  Department,
  Note,
  Paper,
  filterService,
  notesService,
  papersService,
} from '../../services/api';
import {
  assertReachableFile,
  getDocumentKind,
  getDownloadFileName,
  getDownloadUrl,
  resolveFileUrl,
} from '../../utils/files';

type PublicRoute = 'Login' | 'Signup' | 'Browse' | 'Departments' | 'PDFViewer';

type HomeScreenProps = {
  navigation: {
    navigate: (screen: PublicRoute, params?: Record<string, unknown>) => void;
  };
};

type HomeResource = (Note | Paper) & {
  resourceType: 'note' | 'paper';
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'Home' | 'Notes' | 'Paper' | 'Profile'>('Home');
  const [openingId, setOpeningId] = useState('');
  const [downloadingId, setDownloadingId] = useState('');
  const [fileError, setFileError] = useState('');

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
      setError(err.response?.data?.message || err.message || 'Unable to load data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const totals = useMemo(
    () => ({
      notes: notes.length,
      papers: papers.length,
      departments: departments.length,
    }),
    [departments.length, notes.length, papers.length]
  );

  const latestResources = useMemo<HomeResource[]>(
    () => [
      ...notes.slice(0, 2).map((note) => ({ ...note, resourceType: 'note' as const })),
      ...papers.slice(0, 2).map((paper) => ({ ...paper, resourceType: 'paper' as const })),
    ].sort((a, b) => Date.parse(b.createdAt || '') - Date.parse(a.createdAt || '')).slice(0, 4),
    [notes, papers]
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  const openResource = async (resource: HomeResource) => {
    const fileUrl = resolveFileUrl(resource.fileUrl);
    if (resource.fileAvailable === false || !fileUrl) {
      setFileError('This uploaded file is missing on the server. Please re-upload it.');
      return;
    }

    setOpeningId(resource.id);
    setFileError('');
    try {
      await assertReachableFile(fileUrl);
      navigation.navigate('PDFViewer', {
        title: resource.title,
        url: fileUrl,
        fileName: getDownloadFileName(resource.title, fileUrl),
      });
    } catch (error: any) {
      const message = error.message || 'Unable to open this file.';
      setFileError(message);
      Alert.alert('Open failed', message);
    } finally {
      setOpeningId('');
    }
  };

  const downloadResource = async (resource: HomeResource) => {
    const fileUrl = resolveFileUrl(resource.fileUrl);
    if (resource.fileAvailable === false || !fileUrl) {
      setFileError('This uploaded file is missing on the server. Please re-upload it.');
      return;
    }

    setDownloadingId(resource.id);
    setFileError('');
    try {
      await assertReachableFile(fileUrl);
      await Linking.openURL(getDownloadUrl(fileUrl, getDownloadFileName(resource.title, fileUrl)));
    } catch (error: any) {
      const message = error.message || 'Unable to download this file.';
      setFileError(message);
      Alert.alert('Download failed', message);
    } finally {
      setDownloadingId('');
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading EduHub..." />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Scrollable content ── */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Bar ── */}
        <View style={styles.topBar}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Ionicons name="school" size={22} color={COLORS.white} />
            </View>
            <Text style={styles.brand}>
              Educ<Text style={styles.brandDot}>.</Text>
            </Text>
          </View>

          {/* Right actions */}
          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={styles.loginPill}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginPillText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hamburgerBtn}
              onPress={() => navigation.navigate('Browse')}
              activeOpacity={0.7}
            >
              <Ionicons name="menu-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Banner ── */}
        <View style={styles.heroBanner}>
          {/* Overlay tint */}
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>START YOUR JOURNEY TODAY</Text>
            </View>

            <Text style={styles.heroTitle}>
              Empowering You with Digital{'\n'}
              <Text style={styles.heroTitleAccent}>Skills</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Our platform makes education flexible and convenient.
            </Text>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* ── Live Stats Card ── */}
        <View style={styles.statsCard}>
          <Text style={styles.statsKicker}>LIVE FROM BACKEND</Text>
          <Text style={styles.statsTitle}>EduHub resources at a glance</Text>

          <View style={styles.connectedRow}>
            <View style={styles.connectedDot} />
            <Text style={styles.connectedText}>Connected</Text>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.statsGrid}>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{totals.notes}</Text>
              <Text style={styles.statsLabel}>NOTES</Text>
            </View>
            <View style={styles.statsItemSep} />
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{totals.papers}</Text>
              <Text style={styles.statsLabel}>PAPERS</Text>
            </View>
            <View style={styles.statsItemSep} />
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{totals.departments}</Text>
              <Text style={styles.statsLabel}>DEPARTMENTS</Text>
            </View>
          </View>
        </View>

        {/* ── Services Section ── */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesKicker}>OUR SERVICES</Text>
          <Text style={styles.servicesTitle}>Everything you need to succeed</Text>

          <View style={styles.servicesGrid}>
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Browse', { initialTab: 'notes' })}
              activeOpacity={0.82}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name="book-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.serviceTitle}>Study Notes</Text>
              <Text style={styles.serviceDesc}>Handwritten & digital notes by subject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Browse', { initialTab: 'papers' })}
              activeOpacity={0.82}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.serviceTitle}>Past Papers</Text>
              <Text style={styles.serviceDesc}>Previous year exam question papers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Departments')}
              activeOpacity={0.82}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name="business-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.serviceTitle}>Departments</Text>
              <Text style={styles.serviceDesc}>Browse by department and course</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.82}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name="person-add-outline" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.serviceTitle}>Join Free</Text>
              <Text style={styles.serviceDesc}>Create an account to upload resources</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Uploads */}
        {fileError ? <Text style={styles.fileErrorText}>{fileError}</Text> : null}
        {latestResources.length > 0 ? (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.servicesKicker}>RECENT UPLOADS</Text>
                <Text style={styles.servicesTitle}>Open notes and papers</Text>
              </View>
              <TouchableOpacity
                style={styles.seeAllBtn}
                onPress={() => navigation.navigate('Browse', { initialTab: 'notes' })}
                activeOpacity={0.8}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {latestResources.map((resource) => {
              const isOpening = openingId === resource.id;
              const isDownloading = downloadingId === resource.id;
              const kind = resource.fileAvailable === false ? 'Missing file' : getDocumentKind(resource.fileUrl);
              return (
                <View key={`${resource.resourceType}-${resource.id}`} style={styles.noteCard}>
                  <TouchableOpacity
                    style={styles.noteOpenArea}
                    onPress={() => openResource(resource)}
                    activeOpacity={0.86}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${resource.title}`}
                    disabled={isOpening || isDownloading || resource.fileAvailable === false}
                  >
                    <View style={styles.noteIcon}>
                      {isOpening ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      ) : (
                        <Ionicons name={resource.resourceType === 'note' ? 'reader-outline' : 'document-text-outline'} size={20} color={COLORS.primary} />
                      )}
                    </View>
                    <View style={styles.noteBody}>
                      <Text style={styles.noteTitle} numberOfLines={1}>{resource.title}</Text>
                      <Text style={styles.noteMeta} numberOfLines={1}>{kind} - {resource.subject}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.downloadBtnSmall}
                    onPress={() => downloadResource(resource)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`Download ${resource.title}`}
                    disabled={isOpening || isDownloading || resource.fileAvailable === false}
                  >
                    {isDownloading ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <Ionicons name="download-outline" size={18} color={COLORS.white} />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : null}
        {/* ── CTA Banner ── */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <Text style={styles.ctaSubtitle}>Join thousands of students already using EduHub.</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Create Free Account</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
      <View style={styles.tabBar}>
        {(
          [
            { name: 'Home', icon: 'home', screen: null },
            { name: 'Notes', icon: 'reader-outline', screen: 'Browse' as PublicRoute, params: { initialTab: 'notes' } },
            { name: 'Paper', icon: 'document-text-outline', screen: 'Browse' as PublicRoute, params: { initialTab: 'papers' } },
            { name: 'Profile', icon: 'person-outline', screen: 'Login' as PublicRoute },
          ] as Array<{
            name: 'Home' | 'Notes' | 'Paper' | 'Profile';
            icon: string;
            screen: PublicRoute | null;
            params?: Record<string, unknown>;
          }>
        ).map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => {
                setActiveTab(tab.name);
                if (tab.screen) navigation.navigate(tab.screen, tab.params);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={(isActive ? tab.icon.replace('-outline', '') : tab.icon) as any}
                size={22}
                color={isActive ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 16,
  },

  /* ── Top Bar ── */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brand,
    ...SHADOWS.lift,
  },
  brand: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandDot: {
    color: COLORS.primary,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loginPill: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lift,
  },
  loginPillText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  hamburgerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /* ── Hero Banner ── */
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.brand,
    minHeight: 170,
    marginBottom: 20,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,24,38,0.45)',
  },
  heroContent: {
    padding: 22,
    paddingBottom: 26,
    gap: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  heroBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
  heroTitleAccent: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  heroSubtitle: {
    color: 'rgba(204,251,241,0.8)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },

  /* ── Error ── */
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.errorBg,
    borderRadius: 8,
    padding: 10,
  },

  /* ── Live Stats Card ── */
  statsCard: {
    marginHorizontal: 16,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    padding: 20,
    marginBottom: 22,
    ...SHADOWS.card,
  },
  statsKicker: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statsTitle: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  connectedText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '700',
  },
  statsDivider: {
    height: 3,
    width: 36,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginVertical: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsItem: {
    flex: 1,
  },
  statsItemSep: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },
  statsValue: {
    color: COLORS.textDark,
    fontSize: 26,
    fontWeight: '900',
  },
  statsLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  /* ── Services ── */
  servicesSection: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  servicesKicker: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  servicesTitle: {
    color: COLORS.textDark,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 16,
    lineHeight: 28,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  serviceDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },

  fileErrorText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '800',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.errorBg,
    borderRadius: 8,
    padding: 10,
  },

  /* ── Recent Uploads ── */
  recentSection: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  seeAllBtn: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.warningBg,
  },
  seeAllText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    padding: 12,
    marginBottom: 10,
    ...SHADOWS.card,
  },
  noteOpenArea: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noteIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBody: {
    flex: 1,
    minWidth: 0,
  },
  noteTitle: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  noteMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  downloadBtnSmall: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── CTA Banner ── */
  ctaBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    backgroundColor: COLORS.brand,
    padding: 22,
    gap: 10,
  },
  ctaTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
  },
  ctaSubtitle: {
    color: 'rgba(204,251,241,0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 4,
  },
  ctaBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },

  /* ── Bottom Tab Bar ── */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    shadowColor: COLORS.brandDark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
    gap: 3,
  },
  tabItemActive: {
    backgroundColor: COLORS.brand,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.white,
  },
});
