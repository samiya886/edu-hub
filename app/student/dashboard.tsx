import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function StudentDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <Link href="/student/notes" style={styles.card}>View Notes</Link>
      <Link href="/student/papers" style={styles.card}>View Papers</Link>
      <Link href="/student/upload" style={styles.card}>Upload File</Link>
      <Link href="/student/profile" style={styles.card}>Profile</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { marginBottom: 8, color: '#172033', fontSize: 28, fontWeight: '800' },
  card: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', fontSize: 16, fontWeight: '700', padding: 18 },
});
