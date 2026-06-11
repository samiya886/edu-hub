import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function StudentUpload() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload</Text>
      <TextInput style={styles.input} placeholder="Title" />
      <TextInput style={styles.input} placeholder="Subject" />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Choose File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload</Text>
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
