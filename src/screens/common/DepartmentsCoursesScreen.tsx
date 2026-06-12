import React, { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { FilterChip } from '../../components/FilterChip';
import { Loader } from '../../components/Loader';
import { SearchBar } from '../../components/SearchBar';
import { COLORS } from '../../constants';
import { Course, Department, filterService, Subject } from '../../services/api';

export default function DepartmentsCoursesScreen() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setError('');
        const list = await filterService.getDepartments();
        setDepartments(list);
      } catch (err: any) {
        console.error('Failed to load departments', err);
        setError(err.response?.data?.message || err.message || 'Failed to load departments.');
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    if (!selectedDept) {
      setCourses([]);
      setSubjects([]);
      setSelectedCourse('');
      return;
    }

    const loadCourses = async () => {
      try {
        setError('');
        setLoadingCourses(true);
        const list = await filterService.getCourses(selectedDept);
        setCourses(list);
        setSubjects([]);
        setSelectedCourse('');
      } catch (err: any) {
        console.error('Failed to load courses', err);
        setError(err.response?.data?.message || err.message || 'Failed to load courses.');
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, [selectedDept]);

  useEffect(() => {
    if (!selectedCourse) {
      setSubjects([]);
      return;
    }

    const loadSubjects = async () => {
      try {
        setError('');
        setLoadingCourses(true);
        const list = await filterService.getSubjects(selectedCourse);
        setSubjects(list);
      } catch (err: any) {
        console.error('Failed to load subjects', err);
        setError(err.response?.data?.message || err.message || 'Failed to load subjects.');
      } finally {
        setLoadingCourses(false);
      }
    };

    loadSubjects();
  }, [selectedCourse]);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return departments;

    return departments.filter((department) =>
      `${department.name} ${department.code}`.toLowerCase().includes(query)
    );
  }, [departments, search]);

  if (loading) {
    return <Loader fullScreen message="Loading departments..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Academic catalog</Text>
        <Text style={styles.title}>Departments & Courses</Text>
        <Text style={styles.subtitle}>Browse the same departments, courses, and subjects used by the website.</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search departments..." />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.filterBand}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterChip label="All" active={!selectedDept} onPress={() => setSelectedDept('')} />
          {departments.map((department) => (
            <FilterChip
              key={department.id}
              label={department.code || department.name}
              active={selectedDept === department.id}
              onPress={() => setSelectedDept(department.id)}
            />
          ))}
        </ScrollView>
      </View>

      {selectedDept ? (
        <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent}>
          {loadingCourses ? <Loader message="Loading catalog..." /> : null}

          <Text style={styles.sectionTitle}>Courses</Text>
          {courses.length === 0 && !loadingCourses ? (
            <EmptyState title="No courses found" message="This department does not have courses yet." icon="albums-outline" />
          ) : (
            <View style={styles.courseGrid}>
              {courses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={[styles.courseCard, selectedCourse === course.id && styles.activeCourseCard]}
                  onPress={() => setSelectedCourse(course.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="book-outline"
                    size={20}
                    color={selectedCourse === course.id ? COLORS.white : COLORS.primary}
                  />
                  <Text style={[styles.courseName, selectedCourse === course.id && styles.activeCourseText]}>
                    {course.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedCourse ? (
            <>
              <Text style={styles.sectionTitle}>Subjects</Text>
              {subjects.length === 0 && !loadingCourses ? (
                <EmptyState title="No subjects found" message="This course does not have subjects yet." icon="library-outline" />
              ) : (
                subjects.map((subject) => (
                  <Card key={subject.id} title={subject.name}>
                    <Text style={styles.subjectMeta}>{subject.code || 'Subject'}</Text>
                  </Card>
                ))
              )}
            </>
          ) : null}
        </ScrollView>
      ) : (
        <FlatList
          data={filteredDepartments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState title="No departments found" icon="school-outline" />}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedDept(item.id)} activeOpacity={0.8}>
              <Card
                title={item.name}
                headerRight={<Ionicons name="chevron-forward" size={18} color={COLORS.primary} />}
              >
                <Text style={styles.departmentCode}>{item.code}</Text>
              </Card>
            </TouchableOpacity>
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
    borderRadius: 8,
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
  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: 'rgba(204,251,241,0.72)',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  searchWrap: {
    padding: 16,
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
  filterBand: {
    paddingBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  listContent: {
    padding: 16,
  },
  departmentCode: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  detailScroll: {
    flex: 1,
  },
  detailContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 8,
  },
  courseGrid: {
    gap: 10,
    marginBottom: 16,
  },
  courseCard: {
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
  activeCourseCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  courseName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },
  activeCourseText: {
    color: COLORS.white,
  },
  subjectMeta: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
