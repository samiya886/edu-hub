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

  // Load Filters on Mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const depts = await filterService.getDepartments().catch(() => getMockDepts());
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load departments', err);
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
        const list = await filterService.getCourses(selectedDept).catch(() => getMockCourses(selectedDept));
        setCourses(list);
        setSelectedCourse('');
        setSelectedSubject('');
      } catch (err) {
        console.error('Failed to load courses', err);
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
        const list = await filterService.getSubjects(selectedCourse).catch(() => getMockSubjects(selectedCourse));
        setSubjects(list);
        setSelectedSubject('');
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    };
    loadSubjects();
  }, [selectedCourse]);

  // Fetch Notes/Papers when active tab, filters, or search changes
  const fetchData = async () => {
    setLoading(true);
    try {
      const filters = {
        department: selectedDept || undefined,
        course: selectedCourse || undefined,
        subject: selectedSubject || undefined,
        search: search || undefined,
      };

      if (activeTab === 'notes') {
        const list = await notesService.list(filters).catch(() => getMockNotes());
        // Frontend search simulation if backend list fails
        const filteredList = list.filter(n =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.subject.toLowerCase().includes(search.toLowerCase())
        );
        setNotes(filteredList);
      } else {
        const list = await papersService.list(filters).catch(() => getMockPapers());
        const filteredList = list.filter(p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.subject.toLowerCase().includes(search.toLowerCase())
        );
        setPapers(filteredList);
      }
    } catch (err) {
      console.error('Error fetching materials', err);
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

  // --- Mock Fallback Data ---
  const getMockDepts = (): Department[] => [
    { id: 'cs', name: 'Computer Science', code: 'CS' },
    { id: 'ee', name: 'Electrical Engineering', code: 'EE' },
  ];

  const getMockCourses = (deptId: string): Course[] => {
    if (deptId === 'cs') {
      return [
        { id: 'cs-se', departmentId: 'cs', name: 'Software Engineering', code: 'CS-SE' },
        { id: 'cs-ai', departmentId: 'cs', name: 'Artificial Intelligence', code: 'CS-AI' },
      ];
    }
    return [
      { id: 'ee-power', departmentId: 'ee', name: 'Power Systems', code: 'EE-PS' }
    ];
  };

  const getMockSubjects = (courseId: string): Subject[] => {
    if (courseId === 'cs-se') {
      return [
        { id: 'subj-cn', courseId: 'cs-se', name: 'Computer Networks', code: 'CN' },
        { id: 'subj-oops', courseId: 'cs-se', name: 'Object Oriented Programming', code: 'OOPS' },
      ];
    }
    return [
      { id: 'subj-ml', courseId: 'cs-ai', name: 'Machine Learning', code: 'ML' }
    ];
  };

  const getMockNotes = (): Note[] => [
    {
      id: 'mock-n1',
      title: 'Intro to Computer Networks',
      subject: 'Computer Networks',
      department: 'CS',
      course: 'Software Engineering',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: { id: 't1', name: 'Dr. Sarah Jenkins' },
      downloadsCount: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'mock-n2',
      title: 'OOP Design Patterns',
      subject: 'Object Oriented Programming',
      department: 'CS',
      course: 'Software Engineering',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: { id: 't2', name: 'Prof. Mark Wood' },
      downloadsCount: 8,
      createdAt: new Date().toISOString(),
    }
  ];

  const getMockPapers = (): Paper[] => [
    {
      id: 'mock-p1',
      title: 'Computer Networks 2025 Midterm',
      subject: 'Computer Networks',
      department: 'CS',
      course: 'Software Engineering',
      year: 2025,
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedBy: { id: 't3', name: 'Dr. Alan Turing' },
      downloadsCount: 45,
      createdAt: new Date().toISOString(),
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Resource library</Text>
        <Text style={styles.heroTitle}>Notes & Papers</Text>
        <Text style={styles.heroText}>Filter by department, course, and subject just like the website.</Text>
      </View>

      <View style={styles.searchSection}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={`Search ${activeTab}...`} />
      </View>

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
