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

 return (
  <Provider store={store}>
  <MovieProvider>
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator>
          
            <Stack.Group >
             <Stack.Screen name="MenuInicio" component={LoginScreen} options={{ headerShown: false }} />
             <Stack.Screen name="Recuperar" component={Recuperar} options={{ headerShown: true, headerTitleAlign: 'center',  headerTitle: 'RESTABLECER CONTRASEÑA ', headerTintColor: '#F9FFFF', headerStyle: {backgroundColor: '#2980B9'},}}  />
             <Stack.Screen name="Registrar" component={Register} options={{ headerShown: true, headerTitleAlign: 'center',  headerTitle: 'REGISTRARSE EN FARMERIN ', headerTintColor: '#F9FFFF', headerStyle: {backgroundColor: '#2980B9'},}} />
             <Stack.Screen name="EventosMenu" component={LoggedInTabs} options={{ headerShown: false }} />
             <Stack.Screen name="CerrarSesiones" component={LoginScreen} options={{ headerShown: false }}/>
            </Stack.Group>
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  </MovieProvider>
</Provider>
 );
}
