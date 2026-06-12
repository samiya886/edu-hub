import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { COLORS, UserRole } from '../../constants';

export default function SignupScreen({ navigation }: { navigation: any }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
    } catch (err: any) {
      const serverMessage = typeof err.response?.data === 'string'
        ? undefined
        : err.response?.data?.message;
      setError(serverMessage || err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Ionicons name="school" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.brand}>EduHub<Text style={styles.brandDot}>.</Text></Text>
          </View>
          <Text style={styles.kicker}>Topper Choice</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join students and teachers sharing verified academic resources.</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <Text style={styles.roleLabel}>Register As</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'student' && styles.activeRole]}
              onPress={() => setRole('student')}
              activeOpacity={0.7}
            >
              <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleOption, role === 'teacher' && styles.activeRole]}
              onPress={() => setRole('teacher')}
              activeOpacity={0.7}
            >
              <Text style={[styles.roleText, role === 'teacher' && styles.activeRoleText]}>Teacher</Text>
            </TouchableOpacity>
          </View>

          <Button title="Register" onPress={handleRegister} loading={loading} style={styles.signupBtn} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brand,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 18,
  },
  header: {
    borderRadius: 28,
    backgroundColor: COLORS.brand,
    padding: 22,
    marginBottom: -18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  brand: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandDot: {
    color: COLORS.primary,
  },
  kicker: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(204,251,241,0.72)',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: COLORS.errorBg,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceMuted,
  },
  activeRole: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeRoleText: {
    color: COLORS.white,
  },
  signupBtn: {
    width: '100%',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  loginText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 14,
  },
});
