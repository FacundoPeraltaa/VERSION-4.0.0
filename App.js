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



// Importa los stacks desde sus archivos correspondientes
import HomeScreen from './src/NavEventos';
import ConfigScreen from './src/NavConfiguracion';
import LoginScreen from "./screens/Login"; // Asume que tienes un stack para LoginScreen
import Recuperar from "./screens/Recuperar";
import Register from "./screens/Register";
import WelcomeScreen from './src/Welcome';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function LoggedInTabs() {
  return (
     <Tab.Navigator>
       <Tab.Screen 
         name="BarraEventos" 
         component={HomeScreen} 
         options={{
           headerTitleAlign: 'center', 
           headerTitle: 'EVENTOS', 
           headerTintColor: '#F9FFFF', 
           headerStyle: {backgroundColor: '#2980B9'},
           tabBarIcon: ({ color }) => (
             <MaterialCommunityIcons name="calendar" size={26} color={color} />
           ),
           tabBarLabelStyle: { color: '#2A2A2A' }, 
           tabBarLabel: 'EVENTOS'
         }}
       />
       <Tab.Screen 
         name="BarraConfig" 
         component={ConfigScreen} 
         options={{
           headerTitleAlign: 'center', 
           headerTitle: 'CONFIGURACION', 
           headerTintColor: '#F9FFFF', 
           headerStyle: {backgroundColor: '#2980B9'},
           tabBarIcon: ({ color }) => (
             <MaterialCommunityIcons name="cog" size={26} color={color} />
           ),
           tabBarLabelStyle: { color: '#2A2A2A' }, 
           tabBarLabel: 'CONFIGURACION'
         }}
       />
     </Tab.Navigator>
  );
 }
 

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
  return <WelcomeScreen  />; // Pasa el nombre de usuario como prop
}


 return (
  <Provider store={store}>
  <MovieProvider>
    <GestureHandlerRootView style={{flex:  1}}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            // Pantallas para usuarios logueados
            <Stack.Screen name="EventosMenu" component={LoggedInTabs} options={{ headerShown: false }} />
          ) : (
            // Pantallas de autenticación
            <Stack.Group>
              <Stack.Screen name="MenuInicio" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Recuperar" component={Recuperar} options={{ headerShown: true, headerTitleAlign: 'center',  headerTitle: 'RESTABLECER CONTRASEÑA ', headerTintColor: '#F9FFFF', headerStyle: {backgroundColor: '#1988A5'},}}  />
              <Stack.Screen name="Registrar" component={Register} options={{ headerShown: true, headerTitleAlign: 'center',  headerTitle: 'REGISTRARSE EN FARMERIN ', headerTintColor: '#F9FFFF', headerStyle: {backgroundColor: '#1988A5'},}} />
              <Stack.Screen name="EventosMenu" component={LoggedInTabs} options={{ headerShown: false }} />
              <Stack.Screen name="CerrarSesiones" component={LoginScreen} options={{ headerShown: false }}/>
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  </MovieProvider>
</Provider>
 );
}