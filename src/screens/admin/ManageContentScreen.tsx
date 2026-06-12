import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notesService, papersService, Note, Paper } from '../../services/api';
import { COLORS } from '../../constants';
import { Card } from '../../components/Card';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';

export default function ManageContentScreen() {
  const [activeTab, setActiveTab] = useState<'notes' | 'papers'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      if (activeTab === 'notes') {
        const list = await notesService.list();
        setNotes(list);
      } else {
        const list = await papersService.list();
        setPapers(list);
      }
    } catch (err: any) {
      console.error('Error fetching admin content', err);
      setError(err.response?.data?.message || err.message || 'Unable to load content.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = (id: string, type: 'note' | 'paper') => {
    Alert.alert('Delete Content', 'Are you sure you want to permanently delete this resource from the platform?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            if (type === 'note') {
              await notesService.delete(id);
              setNotes(prev => prev.filter(n => n.id !== id));
            } else {
              await papersService.delete(id);
              setPapers(prev => prev.filter(p => p.id !== id));
            }
            Alert.alert('Success', 'Resource removed successfully.');
            fetchData();
          } catch (err: any) {
            console.error('Failed to remove content', err);
            Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to remove content');
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
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

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {loading && !refreshing ? (
        <Loader message={`Loading ${activeTab}...`} />
      ) : activeTab === 'notes' ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<EmptyState title="No notes found" />}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              headerRight={
                <TouchableOpacity onPress={() => handleDelete(item.id, 'note')} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              }
            >
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Subject: <Text style={styles.metaValue}>{item.subject}</Text></Text>
                <Text style={styles.metaLabel}>Uploaded By: <Text style={styles.metaValue}>{item.uploadedBy.name}</Text></Text>
                <Text style={styles.metaLabel}>Downloads: <Text style={styles.metaValue}>{item.downloadsCount}</Text></Text>
              </View>
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
          ListEmptyComponent={<EmptyState title="No papers found" />}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              headerRight={
                <TouchableOpacity onPress={() => handleDelete(item.id, 'paper')} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              }
            >
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Subject: <Text style={styles.metaValue}>{item.subject}</Text></Text>
                <Text style={styles.metaLabel}>Year: <Text style={styles.metaValue}>{item.year}</Text></Text>
                <Text style={styles.metaLabel}>Downloads: <Text style={styles.metaValue}>{item.downloadsCount}</Text></Text>
              </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.transparent,
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '700',
    margin: 16,
    marginBottom: 0,
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  deleteBtn: {
    padding: 6,
  },
  metaRow: {
    gap: 4,
  },
  metaLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  metaValue: {
    color: COLORS.text,
    fontWeight: '600',
  },
});
