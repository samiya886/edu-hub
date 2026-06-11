import { StyleSheet, Text, View } from 'react-native';

export default function TeacherProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.card}>Name: Teacher User</Text>
      <Text style={styles.card}>Role: Teacher</Text>
      <Text style={styles.card}>Email: teacher@example.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  card: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', padding: 16 },
});
