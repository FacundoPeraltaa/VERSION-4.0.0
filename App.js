import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import { MovieProvider } from './screens/Contexto';
import registerNNPushToken from 'native-notify';


// Importa los stacks desde sus archivos correspondientes
import HomeScreen from './src/NavEventos';
import ConfigScreen from './src/NavConfiguracion';
import LoginScreen from "./screens/Login"; // Asume que tienes un stack para LoginScreen
import Recuperar from "./screens/Recuperar";
import Register from "./screens/Register";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function LoggedInTabs() {
 return (
    <Tab.Navigator>
      <Tab.Screen name="Eventos" component={HomeScreen} />
      <Tab.Screen name="Configuracion" component={ConfigScreen} />
    </Tab.Navigator>
 );
}

export default function App() {
 registerNNPushToken(4382, 'XSlDDRiRyq1qAZLssswMTu');

 // Define una variable de estado para manejar el estado de login
 const [isLoggedIn, setIsLoggedIn] = useState(false);

 return (
  <Provider store={store}>
  <MovieProvider>
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            // Pantallas para usuarios logueados
            <Stack.Screen name="LoggedInTabs" component={LoggedInTabs} />
          ) : (
            // Pantallas de autenticación
            <Stack.Group screenOptions={{ headerShown: false }}>
             <Stack.Screen name="Login" component={LoginScreen} />
             <Stack.Screen name="Recuperar" component={Recuperar} />
             <Stack.Screen name="Registrar" component={Register} />
             <Stack.Screen name="EventosMenu" component={LoggedInTabs} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  </MovieProvider>
</Provider>
 );
}
