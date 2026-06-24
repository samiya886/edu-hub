import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notesService, papersService, filterService, Note, Paper, Department, Course, Subject } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { SearchBar } from '../../components/SearchBar';
import { FilterChip } from '../../components/FilterChip';

export default function NotesPapersScreen({ route, navigation }: { route: any; navigation: any }) {
  const searchQuery = route.params?.searchQuery || '';
  const initialTab = route.params?.initialTab || 'notes';

  const [activeTab, setActiveTab] = useState<'notes' | 'papers'>(initialTab);
  const [search, setSearch] = useState(searchQuery);

  // Filters State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // Data List State
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Load Filters on Mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const depts = await filterService.getDepartments();
        setDepartments(depts);
      } catch (err: any) {
        console.error('Failed to load departments', err);
        setError(err.response?.data?.message || err.message || 'Failed to load departments.');
      }
    };
    loadFilters();
  }, []);

  // Cascading Filter: Fetch Courses when Dept changes
  useEffect(() => {
    if (!selectedDept) {
      setCourses([]);
      setSubjects([]);
      setSelectedCourse('');
      setSelectedSubject('');
      return;
    }
    const loadCourses = async () => {
      try {
        const list = await filterService.getCourses(selectedDept);
        setCourses(list);
        setSelectedCourse('');
        setSelectedSubject('');
      } catch (err: any) {
        console.error('Failed to load courses', err);
        setError(err.response?.data?.message || err.message || 'Failed to load courses.');
      }
    };
    loadCourses();
  }, [selectedDept]);

  // Cascading Filter: Fetch Subjects when Course changes
  useEffect(() => {
    if (!selectedCourse) {
      setSubjects([]);
      setSelectedSubject('');
      return;
    }
    const loadSubjects = async () => {
      try {
        const list = await filterService.getSubjects(selectedCourse);
        setSubjects(list);
        setSelectedSubject('');
      } catch (err: any) {
        console.error('Failed to load subjects', err);
        setError(err.response?.data?.message || err.message || 'Failed to load subjects.');
      }
    };
    loadSubjects();
  }, [selectedCourse]);

  // Fetch Notes/Papers when active tab, filters, or search changes
  const fetchData = async () => {
    setLoading(true);
    try {
      setError('');
      const filters = {
        department: selectedDept || undefined,
        course: selectedCourse || undefined,
        subject: selectedSubject || undefined,
        search: search || undefined,
      };

      if (activeTab === 'notes') {
        const list = await notesService.list(filters);
        const filteredList = list.filter(n =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.subject.toLowerCase().includes(search.toLowerCase())
        );
        setNotes(filteredList);
      } else {
        const list = await papersService.list(filters);
        const filteredList = list.filter(p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.subject.toLowerCase().includes(search.toLowerCase())
        );
        setPapers(filteredList);
      }
    } catch (err: any) {
      console.error('Error fetching materials', err);
      setError(err.response?.data?.message || err.message || 'Failed to load materials.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedDept, selectedCourse, selectedSubject, search]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.kicker}>Resource library</Text>
            <Text style={styles.heroTitle}>Notes & Papers</Text>
          </View>
          <TouchableOpacity
            style={styles.hamburgerBtn}
            onPress={() => {
              if (navigation.openDrawer) navigation.openDrawer();
              else navigation.goBack();
            }}
            activeOpacity={0.75}
          >
            <Ionicons name="menu-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.heroText}>Filter by department, course, and subject just like the website.</Text>
      </View>

      <View style={styles.searchSection}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={`Search ${activeTab}...`} />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'papers' && styles.activeTab]}
          onPress={() => setActiveTab('papers')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'papers' && styles.activeTabText]}>Papers</Text>
        </TouchableOpacity>
      </View>

      {/* Cascading Filter Section */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {/* Dept Filter */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.filterLabel}>Dept:</Text>
            <ScrollView horizontal style={styles.filterButtons}>
              <FilterChip label="All" active={!selectedDept} onPress={() => setSelectedDept('')} />
              {departments.map(d => (
                <FilterChip key={d.id} label={d.code} active={selectedDept === d.id} onPress={() => setSelectedDept(d.id)} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Course and Subject Cascading Buttons */}
        {selectedDept && courses.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subFilterScroll}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.filterLabel}>Course:</Text>
              <FilterChip label="All" active={!selectedCourse} onPress={() => setSelectedCourse('')} />
              {courses.map(c => (
                <FilterChip key={c.id} label={c.code} active={selectedCourse === c.id} onPress={() => setSelectedCourse(c.id)} />
              ))}
            </View>
          </ScrollView>
        )}

        {selectedCourse && subjects.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subFilterScroll}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.filterLabel}>Subject:</Text>
              <FilterChip label="All" active={!selectedSubject} onPress={() => setSelectedSubject('')} />
              {subjects.map(s => (
                <FilterChip key={s.id} label={s.name} active={selectedSubject === s.id} onPress={() => setSelectedSubject(s.id)} />
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Materials List */}
      {loading ? (
        <Loader message={`Loading ${activeTab}...`} />
      ) : activeTab === 'notes' ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<EmptyState title="No notes found" message="Try adjusting your filters or search term." />}
          renderItem={({ item }) => (
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
                  <Ionicons name="bookmark-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{item.subject}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>By {item.uploadedBy.name}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('PDFViewer', { title: item.title, url: item.fileUrl })}
              >
                <Text style={styles.actionBtnText}>Read Document</Text>
                <Ionicons name="eye" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={papers}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<EmptyState title="No papers found" message="Try adjusting your filters or search term." />}
          renderItem={({ item }) => (
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
                  <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>Year: {item.year}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="bookmark-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>{item.subject}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('PDFViewer', { title: item.title, url: item.fileUrl })}
              >
                <Text style={styles.actionBtnText}>Read Exam Paper</Text>
                <Ionicons name="eye" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 28,
    backgroundColor: COLORS.brand,
    padding: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hamburgerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '900',
  },
  heroText: {
    marginTop: 6,
    color: 'rgba(204,251,241,0.72)',
    fontWeight: '700',
    lineHeight: 20,
  },
  searchSection: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 4,
    borderRadius: 18,
    backgroundColor: COLORS.white,
  },
  tab: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderBottomWidth: 0,
    borderBottomColor: COLORS.transparent,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  filterSection: {
    backgroundColor: COLORS.background,
    paddingVertical: 12,
    gap: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  subFilterScroll: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.text,
    width: 50,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  listContainer: {
    padding: 16,
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
    marginBottom: 16,
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
  actionBtn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.brand,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
});
