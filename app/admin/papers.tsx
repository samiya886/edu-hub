import { StyleSheet, Text, View } from 'react-native';

const papers = ['Mathematics Final 2025', 'Science Midterm 2025', 'English Sample Paper'];

export default function ManagePapers() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Papers</Text>
      {papers.map((paper) => (
        <Text key={paper} style={styles.item}>{paper}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 24, backgroundColor: '#f4f7fb' },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  item: { borderRadius: 8, backgroundColor: '#ffffff', color: '#172033', padding: 16 },
});
