import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import registerNNPushToken from 'native-notify';
import 'expo-firestore-offline-persistence'; // Habilita offline persistence

// Importa los stacks desde sus archivos correspondientes
import store from './src/store';
import { MovieProvider } from './screens/Contexto';
import HomeScreen from './src/NavEventos';
import ConfigScreen from './src/NavConfiguracion';
import LoginScreen from "./screens/Login";
import Recuperar from "./screens/Recuperar";
import Register from "./screens/Register";
import WelcomeScreen from './src/Welcome';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoggedInTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'BarraEventos' ? 'calendar' : 'cog';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2980B9',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#F9F9F9',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        headerStyle: {
          backgroundColor: '#287fb9',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          color: '#F9FFFF',
        },
        headerTintColor: '#F9FFFF',
      })}
    >
      <Tab.Screen name="BarraEventos" component={HomeScreen} options={{ title: 'EVENTOS' }} />
      <Tab.Screen name="BarraConfig" component={ConfigScreen} options={{ title: 'CONFIGURACIÓN' }} />
    </Tab.Navigator>
  );
};

const App = () => {
  registerNNPushToken(4382, 'XSlDDRiRyq1qAZLssswMTu');

  // Define una variable de estado para manejar el estado de login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica la autenticación al iniciar la app
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const usuario = await AsyncStorage.getItem('usuario');
        setIsLoggedIn(usuario !== null);
      } catch (error) {
        console.error("Error al verificar la autenticación: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthentication();
  }, []);

  // Si loading es verdadero, muestra la pantalla de bienvenida
  if (loading) {
    return <WelcomeScreen />;
  }

  return (
    <Provider store={store}>
      <MovieProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#4cb050',
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: '#F9FFFF',
                },
                headerTintColor: '#F9FFFF',
              }}
            >
              {isLoggedIn ? (
                <Stack.Screen name="MenuEventos" component={LoggedInTabs} options={{ headerShown: false }} />
              ) : (
                <Stack.Group>
                  <Stack.Screen name="MenuInicio" component={LoginScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Recuperar" component={Recuperar} options={{ title: 'RESTABLECER CONTRASEÑA' }} />
                  <Stack.Screen name="Registrar" component={Register} options={{ title: 'REGISTRARSE EN FARMERIN' }} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </MovieProvider>
    </Provider>
  );
};

export default App;
