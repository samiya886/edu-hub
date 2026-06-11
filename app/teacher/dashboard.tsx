import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TeacherDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>
      <Link href="/teacher/upload-notes" style={styles.card}>Upload Notes</Link>
      <Link href="/teacher/upload-papers" style={styles.card}>Upload Papers</Link>
      <Link href="/teacher/profile" style={styles.card}>Profile</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { marginBottom: 8, color: '#172033', fontSize: 28, fontWeight: '800' },
  card: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', fontSize: 16, fontWeight: '700', padding: 18 },
});
