import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Link href="/admin/users" style={styles.card}>Manage Users</Link>
      <Link href="/admin/notes" style={styles.card}>Manage Notes</Link>
      <Link href="/admin/papers" style={styles.card}>Manage Papers</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { marginBottom: 8, color: '#172033', fontSize: 28, fontWeight: '800' },
  card: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', fontSize: 16, fontWeight: '700', padding: 18 },
});
