import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/auth/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import NotesPapersScreen from '../screens/student/NotesPapersScreen';
import DepartmentsCoursesScreen from '../screens/common/DepartmentsCoursesScreen';
import PDFViewerScreen from '../screens/common/PDFViewerScreen';
import { COLORS } from '../constants';

export type AuthStackParamList = {
  Home: undefined;
  Browse: { initialTab?: 'notes' | 'papers'; searchQuery?: string } | undefined;
  Departments: undefined;
  PDFViewer: { title: string; url: string };
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Browse" component={NotesPapersScreen} />
      <Stack.Screen name="Departments" component={DepartmentsCoursesScreen} />
      <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
