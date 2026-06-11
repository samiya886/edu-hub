import { Link } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Full name" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <Link href="/login" style={styles.link}>Already have an account?</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 14,
    padding: 24,
    backgroundColor: '#f4f7fb',
  },
  title: {
    color: '#172033',
    fontSize: 28,
    fontWeight: '800',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#2563eb',
    padding: 14,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
    textAlign: 'center',
  },
});
