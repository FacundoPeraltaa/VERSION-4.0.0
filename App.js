import 'react-native-gesture-handler';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import Eventos from './src/NavEventos';
import Config from './src/NavConfiguracion';
import { MovieProvider } from './screens/Contexto';
import registerNNPushToken from 'native-notify';

import Recuperar from './screens/Recuperar';
import Register from './screens/Register';
import LoginScreen from "./screens/Login";



const Tab = createBottomTabNavigator();


function MyAppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Eventos') {
            iconName = 'home';
          } else if (route.name === 'Configuracion') {
            iconName = 'cog';
          }

          return <MaterialCommunityIcons name={iconName} color={'#1888a4'} size={size} backgroundColor={'C2D300'} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#1888a4',
        inactiveTintColor: '#1888a4',
        backgroundColor: '#C2D300'
      }}
    >
      <Tab.Screen
        name="Eventos"
        component={Eventos}
        options={{ tabBarLabel: 'EVENTOS', headerShown: false }}
      />
      <Tab.Screen
        name="Configuracion"
        component={Config}
        options={{ tabBarLabel: 'CONFIGURACIÓN ', headerShown: false}}
      />
    </Tab.Navigator>
  );
}


const Navigation = () => {
  return (
    <NavigationContainer>
      <MyAppNavigator >
      </MyAppNavigator>
    </NavigationContainer>
  );
};

export default function App() {
  registerNNPushToken(4382, 'XSlDDRiRyq1qAZLssswMTu');

  return (
    <Provider store={store}>
      <MovieProvider>
        <Navigation >
       
        </Navigation>
      </MovieProvider>
    </Provider>
  );
}