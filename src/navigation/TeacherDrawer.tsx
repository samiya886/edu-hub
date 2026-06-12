import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

// Screen Imports
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import UploadScreen from '../screens/student/UploadScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import PDFViewerScreen from '../screens/common/PDFViewerScreen';
import NotesPapersScreen from '../screens/student/NotesPapersScreen';
import DepartmentsCoursesScreen from '../screens/common/DepartmentsCoursesScreen';

export type TeacherStackParamList = {
  HomeTabs: undefined;
  PDFViewer: { title: string; url: string };
};

const Stack = createNativeStackNavigator<TeacherStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
function TeacherTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'book-outline';
          if (route.name === 'Dashboard') iconName = 'grid-outline';
          else if (route.name === 'NotesPapers') iconName = 'library-outline';
          else if (route.name === 'Catalog') iconName = 'business-outline';
          else if (route.name === 'Upload') iconName = 'add-circle-outline';
          else if (route.name === 'Notifications') iconName = 'notifications-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.transparent,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          shadowColor: COLORS.brandDark,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.08,
          shadowRadius: 18,
          elevation: 12,
        },
        tabBarLabelStyle: { fontWeight: '900', fontSize: 11 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboardScreen} />
      <Tab.Screen name="NotesPapers" component={NotesPapersScreen} options={{ title: 'Browse' }} />
      <Tab.Screen name="Catalog" component={DepartmentsCoursesScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} options={{ title: 'Upload' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Alerts' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Teacher Stack
function TeacherStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={TeacherTabNavigator} />
      <Stack.Screen
        name="PDFViewer"
        component={PDFViewerScreen}
        options={{ headerShown: true, title: 'Document Reader' }}
      />
    </Stack.Navigator>
  );
}

// Custom Drawer
function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'T'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>FACULTY ROLE</Text>
      </View>
      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem
        label="Sign Out"
        labelStyle={styles.signOutLabel}
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={COLORS.error} />}
        onPress={() => logout()}
      />
    </DrawerContentScrollView>
  );
}

export default function TeacherDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTintColor: COLORS.text,
        headerStyle: { backgroundColor: COLORS.white },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '900', fontSize: 16, color: COLORS.text },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textSecondary,
        drawerActiveBackgroundColor: COLORS.warningBg,
        drawerLabelStyle: { fontWeight: '800' },
      }}
    >
      <Drawer.Screen
        name="TeacherApp"
        component={TeacherStack}
        options={{
          title: 'Teacher Panel',
          drawerIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  userRole: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  drawerList: {
    flex: 1,
    paddingTop: 12,
  },
  signOutLabel: {
    color: COLORS.error,
    fontWeight: '600',
  },
});
