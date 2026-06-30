import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EduHub</Text>
      <Text style={styles.subtitle}>Notes, papers, uploads, and dashboards in one place.</Text>
      <View style={styles.links}>
        <Link href="/login" style={styles.link}>Student Login</Link>
        <Link href="/register" style={styles.link}>Register</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
    padding: 24,
    backgroundColor: '#f4f7fb',
  },
  title: {
    color: '#172033',
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
  links: {
    gap: 12,
  },
  link: {
    borderRadius: 8,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    padding: 14,
    textAlign: 'center',
  },
});
