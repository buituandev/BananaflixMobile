import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ route }) {
  const pr = route.params;
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={pr}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <IonIcon name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        initialParams={pr}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <IonIcon name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsScreen"
        initialParams={pr}
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <IonIcon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
