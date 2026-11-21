import React from 'react';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

// Écrans
import LoginScreen from '../screens/auth/LoginScreen';
import AccueilScreen from '../screens/main/AccueilScreen';
import PlanningScreen from '../screens/main/PlanningScreen';
import AcademiqueScreen from '../screens/main/AcademiqueScreen';
import DocumentsScreen from '../screens/main/DocumentsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import NotificationScreen from '../screens/details/NotificationScreen';
import NewPasswordScreen from '../screens/details/NewPasswordScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  const BASE_HEIGHT = 60;

  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F97616',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 1,
          borderTopColor: '#1E293B',
          height: BASE_HEIGHT + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle';
          if (route.name === 'Accueil') iconName = 'home';
          else if (route.name === 'Planning') iconName = 'calendar';
          else if (route.name === 'Académique') iconName = 'book-open';
          else if (route.name === 'Docs & Stages') iconName = 'file-text';
          else if (route.name === 'Profil') iconName = 'user';

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accueil" component={AccueilScreen} />
      <Tab.Screen name="Planning" component={PlanningScreen} />
      <Tab.Screen name="Académique" component={AcademiqueScreen} />
      <Tab.Screen name="Docs & Stages" component={DocumentsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {user === null ? (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
