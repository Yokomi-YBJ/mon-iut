import React from 'react'; // Ne pas oublier d'importer React
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

// Imports des écrans
import LoginScreen from './screens/loginScreens/LoginScreen';
import AccueilScreen from './screens/AccueilScreen';
import PlanningScreen from './screens/PlanningScreen';
import AcademiqueScreen from './screens/AcademiqueScreen';
import StageScreen from './screens/StageScreen';
import ProfilScreen from './screens/ProfileScreen';
import NotificationScreen from './screens/secondScreens/NotificationScreen';
import newPasswordScreen from './screens/secondScreens/newPasswordScreen';

// Import du contexte et du hook
import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- COMPOSANT DES ONGLETS ---
function MainTabs() {
  const insets = useSafeAreaInsets();
  const BASE_HEIGHT = 60;

  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 0,
          height: BASE_HEIGHT + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 0, 
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
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
      <Tab.Screen name="Docs & Stages" component={StageScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

// --- COMPOSANT DE NAVIGATION PRINCIPAL ---
function RootNavigator() {
  const { user } = useAuth(); // On récupère l'utilisateur en temps réel

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      
      {/* LOGIQUE DE REDIRECTION AUTOMATIQUE :
          Si user est null -> On montre le Login
          Si user existe -> On montre les Tabs et les écrans secondaires
      */}
      {user == null ? (
        // Écran affiché si non connecté
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      ) : (
        // Écrans affichés si connecté
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="notification" component={NotificationScreen} />
          <Stack.Screen name="newPassword" component={newPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// --- COMPOSANT EXPORTÉ ---
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}