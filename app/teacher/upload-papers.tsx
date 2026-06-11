import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function UploadPapers() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Papers</Text>
      <TextInput style={styles.input} placeholder="Paper title" />
      <TextInput style={styles.input} placeholder="Year" keyboardType="number-pad" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload Papers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 14, padding: 24, backgroundColor: '#f4f7fb' },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, backgroundColor: '#ffffff', paddingHorizontal: 14 },
  button: { alignItems: 'center', borderRadius: 8, backgroundColor: '#2563eb', padding: 14 },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
