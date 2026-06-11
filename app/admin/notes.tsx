import { StyleSheet, Text, View } from 'react-native';

const notes = ['Algebra Basics', 'Cell Biology', 'World History'];

export default function ManageNotes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Notes</Text>
      {notes.map((note) => (
        <Text key={note} style={styles.item}>{note}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  item: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', padding: 16 },
});
