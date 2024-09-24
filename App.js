import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import { MovieProvider } from './screens/Contexto';
import registerNNPushToken from 'native-notify';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import 'expo-firestore-offline-persistence';   // Habilita offline persistence 

// Importa los stacks desde sus archivos correspondientes
import HomeScreen from './src/NavEventos';
import ConfigScreen from './src/NavConfiguracion';
import LoginScreen from "./screens/Login"; // Asume que tienes un stack para LoginScreen
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
          let iconName;
          if (route.name === 'BarraEventos') {
            iconName = 'calendar';
          } else if (route.name === 'BarraConfig') {
            iconName = 'cog';
          }
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

export default function App() {
  registerNNPushToken(4382, 'XSlDDRiRyq1qAZLssswMTu');

  // Define una variable de estado para manejar el estado de login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica la autenticación al iniciar la app
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Función para verificar la autenticación
  const checkAuthentication = async () => {
    try {
      const usuario = await AsyncStorage.getItem('usuario');
      if (usuario !== null) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error al verificar la autenticación: ", error);
    } finally {
      // Asegúrate de establecer loading en falso al final
      setLoading(false);
    }
  };

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
                // Pantallas para usuarios logueados
                <Stack.Screen name="EventosMenu" component={LoggedInTabs} options={{ headerShown: false }} />
              ) : (
                // Pantallas de autenticación
                <Stack.Group>
                  <Stack.Screen
                    name="MenuInicio"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Recuperar"
                    component={Recuperar}
                    options={{
                      title: 'RESTABLECER CONTRASEÑA',
                    }}
                  />
                  <Stack.Screen
                    name="Registrar"
                    component={Register}
                    options={{
                      title: 'REGISTRARSE EN FARMERIN',
                    }}
                  />
                  <Stack.Screen
                    name="EventosMenu"
                    component={LoggedInTabs}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="CerrarSesiones"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                  />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </MovieProvider>
    </Provider>
  );
}
