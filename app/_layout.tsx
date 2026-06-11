import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'EduHub' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="student/dashboard" options={{ title: 'Student Dashboard' }} />
        <Stack.Screen name="student/notes" options={{ title: 'Notes' }} />
        <Stack.Screen name="student/papers" options={{ title: 'Papers' }} />
        <Stack.Screen name="student/upload" options={{ title: 'Upload' }} />
        <Stack.Screen name="student/profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="teacher/dashboard" options={{ title: 'Teacher Dashboard' }} />
        <Stack.Screen name="teacher/upload-notes" options={{ title: 'Upload Notes' }} />
        <Stack.Screen name="teacher/upload-papers" options={{ title: 'Upload Papers' }} />
        <Stack.Screen name="teacher/profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="admin/login" options={{ title: 'Admin Login' }} />
        <Stack.Screen name="admin/dashboard" options={{ title: 'Admin Dashboard' }} />
        <Stack.Screen name="admin/users" options={{ title: 'Manage Users' }} />
        <Stack.Screen name="admin/notes" options={{ title: 'Manage Notes' }} />
        <Stack.Screen name="admin/papers" options={{ title: 'Manage Papers' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
