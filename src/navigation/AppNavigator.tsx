import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import AuthStack from './AuthStack';
import StudentDrawer from './StudentDrawer';
import TeacherDrawer from './TeacherDrawer';
import AdminDrawer from './AdminDrawer';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Restoring active session..." />;
  }

  return (
    <NavigationContainer>
      {user === null ? (
        <AuthStack />
      ) : user.role === 'student' ? (
        <StudentDrawer />
      ) : user.role === 'teacher' ? (
        <TeacherDrawer />
      ) : user.role === 'admin' ? (
        <AdminDrawer />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
