import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/Auth';
import HomeScreen from './src/screens/Home';
import PilotesScreen from './src/screens/Pilotes';
import GrandsPrixScreen from './src/screens/GrandsPrix';
import ParierScreen from './src/screens/Parier';
import ClassementScreen from './src/screens/Classement';
import ProfilScreen from './src/screens/Profil';
import ModifierPariScreen from './src/screens/ModifierPari';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#0f0f0f',
        borderTopColor: '#e10600',
        borderTopWidth: 2,
        height: 70,
        paddingBottom: 10,
        paddingTop: 5,
      },
      tabBarActiveTintColor: '#e10600',
      tabBarInactiveTintColor: '#555',
      tabBarLabelStyle: { fontSize: 10, letterSpacing: 1, marginBottom: 4 },
      tabBarIcon: ({ color, size }) => {
        const icons: { [key: string]: string } = {
          'Accueil': 'home',
          'Pilotes': 'person',
          'GrandsPrix': 'flag',
          'Parier': 'trophy',
          'Classement': 'podium',
          'Profil': 'settings',
        };
        return <Ionicons name={icons[route.name] as any} size={22} color={color} />;
      },
    })}>
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Pilotes" component={PilotesScreen} />
      <Tab.Screen name="GrandsPrix" component={GrandsPrixScreen} options={{ tabBarLabel: 'Grands Prix' }} />
      <Tab.Screen name="Parier" component={ParierScreen} />
      <Tab.Screen name="Classement" component={ClassementScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Tabs} />
            <Stack.Screen name="ModifierPari" component={ModifierPariScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}