import { StyleSheet, Text, View } from 'react-native';

const users = ['Aarav Student', 'Diya Teacher', 'Admin User'];

export default function ManageUsers() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      {users.map((user) => (
        <Text key={user} style={styles.item}>{user}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  item: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', padding: 16 },
});
