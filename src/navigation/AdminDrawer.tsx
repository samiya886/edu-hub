import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

// Screen Imports
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import ManageContentScreen from '../screens/admin/ManageContentScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import DepartmentsCoursesScreen from '../screens/common/DepartmentsCoursesScreen';

export type AdminStackParamList = {
  HomeTabs: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
function AdminTabNavigator() {
  return (
    <Tab.Navigator
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'shield-outline';
          if (route.name === 'Dashboard') iconName = 'grid-outline';
          else if (route.name === 'Users') iconName = 'people-outline';
          else if (route.name === 'Content') iconName = 'folder-open-outline';
          else if (route.name === 'Catalog') iconName = 'business-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 58,
          paddingBottom: 0,
          paddingTop: 5,
          shadowColor: COLORS.brandDark,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarItemStyle: { height: 52 },
        tabBarLabelStyle: { fontWeight: '900', fontSize: 11 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Users" component={ManageUsersScreen} options={{ title: 'Users' }} />
      <Tab.Screen name="Content" component={ManageContentScreen} options={{ title: 'Content' }} />
      <Tab.Screen name="Catalog" component={DepartmentsCoursesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Admin Stack
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={AdminTabNavigator} />
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
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'A'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userRole}>SYSTEM ADMINISTRATOR</Text>
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

export default function AdminDrawer() {
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
        name="AdminApp"
        component={AdminStack}
        options={{
          title: 'Admin Control Panel',
          drawerIcon: ({ color, size }) => <Ionicons name="key-outline" size={size} color={color} />,
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
