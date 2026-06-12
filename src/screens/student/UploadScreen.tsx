import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notesService, papersService, filterService, Department, Course, Subject } from '../../services/api';
import { COLORS } from '../../constants';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export default function UploadScreen({ navigation }: { navigation: any }) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'note' | 'paper'>('note');
  const [year, setYear] = useState('');

  // Dropdown States
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Dropdown UI Expanders
  const [showDepts, setShowDepts] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);

  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load departments
  useEffect(() => {
    filterService.getDepartments()
      .then(setDepartments)
      .catch((err: any) => {
        console.error('Failed to load departments for upload', err);
        setError(err.response?.data?.message || err.message || 'Failed to load departments.');
      });
  }, []);

  // Fetch courses when dept changes
  useEffect(() => {
    if (!selectedDept) {
      setCourses([]);
      setSelectedCourse('');
      return;
    }
    filterService.getCourses(selectedDept)
      .then(setCourses)
      .catch((err: any) => {
        console.error('Failed to load courses for upload', err);
        setCourses([]);
        setError(err.response?.data?.message || err.message || 'Failed to load courses.');
      });
  }, [selectedDept]);

  // Fetch subjects when course changes
  useEffect(() => {
    if (!selectedCourse) {
      setSubjects([]);
      setSelectedSubject('');
      return;
    }
    filterService.getSubjects(selectedCourse)
      .then(setSubjects)
      .catch((err: any) => {
        console.error('Failed to load subjects for upload', err);
        setSubjects([]);
        setError(err.response?.data?.message || err.message || 'Failed to load subjects.');
      });
  }, [selectedCourse]);

  const handleUpload = async () => {
    setError('');
    if (!title || !selectedDept || !selectedCourse || !selectedSubject) {
      setError('Please fill in all required fields');
      return;
    }
    if (docType === 'paper' && !year) {
      setError('Please specify the paper exam year');
      return;
    }
    if (!fileUrl) {
      setError('Please enter a document URL');
      return;
    }

    setLoading(true);
    try {
      if (docType === 'note') {
        await notesService.upload({
          title,
          subject: selectedSubject,
          course: selectedCourse,
          department: selectedDept,
          fileUrl,
        });
      } else {
        await papersService.upload({
          title,
          subject: selectedSubject,
          course: selectedCourse,
          department: selectedDept,
          year: parseInt(year) || new Date().getFullYear(),
          fileUrl,
        });
      }

      Alert.alert('Success', 'Resource uploaded successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
      ]);
      // Reset form
      setTitle('');
      setSelectedDept('');
      setSelectedCourse('');
      setSelectedSubject('');
      setYear('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Resource upload</Text>
          <Text style={styles.title}>Upload Resource</Text>
          <Text style={styles.subtitle}>
            Share notes and previous year papers with the same academic structure used on the website.
          </Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Doc Type Selector */}
        <Text style={styles.label}>Resource Type *</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, docType === 'note' && styles.activeTab]}
            onPress={() => setDocType('note')}
          >
            <Ionicons name="document-text-outline" size={16} color={docType === 'note' ? COLORS.white : COLORS.textSecondary} />
            <Text style={[styles.tabText, docType === 'note' && styles.activeTabText]}>Study Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, docType === 'paper' && styles.activeTab]}
            onPress={() => setDocType('paper')}
          >
            <Ionicons name="journal-outline" size={16} color={docType === 'paper' ? COLORS.white : COLORS.textSecondary} />
            <Text style={[styles.tabText, docType === 'paper' && styles.activeTabText]}>Exam Paper</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Document Title *"
          placeholder="e.g. Lecture 3 - Routing Protocols"
          value={title}
          onChangeText={setTitle}
        />

        {docType === 'paper' && (
          <Input
            label="Exam Year *"
            placeholder="e.g. 2025"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
          />
        )}

        {/* Department Selector */}
        <Text style={styles.label}>Department *</Text>
        <TouchableOpacity style={styles.dropdown} onPress={() => { setShowDepts(!showDepts); setShowCourses(false); setShowSubjects(false); }}>
          <Text style={selectedDept ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
            {departments.find(d => d.id === selectedDept)?.name || 'Select Department'}
          </Text>
          <Ionicons name={showDepts ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        {showDepts && (
          <View style={styles.dropdownOptions}>
            {departments.map(d => (
              <TouchableOpacity
                key={d.id}
                style={styles.dropdownOption}
                onPress={() => { setSelectedDept(d.id); setShowDepts(false); }}
              >
                <Text style={styles.optionText}>{d.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Course Selector */}
        {selectedDept && courses.length > 0 && (
          <>
            <Text style={[styles.label, { marginTop: 12 }]}>Course *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => { setShowCourses(!showCourses); setShowDepts(false); setShowSubjects(false); }}>
              <Text style={selectedCourse ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                {courses.find(c => c.id === selectedCourse)?.name || 'Select Course'}
              </Text>
              <Ionicons name={showCourses ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {showCourses && (
              <View style={styles.dropdownOptions}>
                {courses.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.dropdownOption}
                    onPress={() => { setSelectedCourse(c.id); setShowCourses(false); }}
                  >
                    <Text style={styles.optionText}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {/* Subject Selector */}
        {selectedCourse && subjects.length > 0 && (
          <>
            <Text style={[styles.label, { marginTop: 12 }]}>Subject *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => { setShowSubjects(!showSubjects); setShowDepts(false); setShowCourses(false); }}>
              <Text style={selectedSubject ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                {subjects.find(s => s.id === selectedSubject)?.name || 'Select Subject'}
              </Text>
              <Ionicons name={showSubjects ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
            {showSubjects && (
              <View style={styles.dropdownOptions}>
                {subjects.map(s => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.dropdownOption}
                    onPress={() => { setSelectedSubject(s.id); setShowSubjects(false); }}
                  >
                    <Text style={styles.optionText}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        <Input
          label="PDF Link (Or document URI) *"
          placeholder="Paste the uploaded document URL"
          value={fileUrl}
          onChangeText={setFileUrl}
          style={{ marginTop: 12 }}
        />

        <Button
          title="Upload Resource"
          onPress={handleUpload}
          loading={loading}
          style={styles.uploadBtn}
        />
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
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.brandDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 3,
  },
  hero: {
    borderRadius: 24,
    backgroundColor: COLORS.brand,
    padding: 18,
    marginBottom: 18,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(204,251,241,0.72)',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: COLORS.errorBg,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceMuted,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
  },
  dropdown: {
    height: 52,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceMuted,
    marginBottom: 12,
  },
  dropdownPlaceholder: {
    color: COLORS.placeholder,
    fontSize: 15,
  },
  dropdownSelectedText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '800',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginTop: -8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  uploadBtn: {
    marginTop: 20,
  },
});
