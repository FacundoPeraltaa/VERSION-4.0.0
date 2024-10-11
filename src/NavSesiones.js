import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import Recuperar from '../screens/Recuperar';
import Register from '../screens/Register';

const Stack = createStackNavigator();

const headerOptions = {
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#B5CD00',
    shadowOffset: { width: 1, height: 1 },
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  headerTitleAlign: 'center',
};

export default function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="MenuSesion"
      screenOptions={headerOptions}
    >
      <Stack.Screen 
        name="MenuSesion" 
        component={LoginScreen} 
        options={{ title: ' INICIAR SESION ' }} 
      />
      <Stack.Screen 
        name="Registrar" 
        component={Register} 
        options={{ title: 'REGISTRARSE' }} 
      />
      <Stack.Screen 
        name="Recuperar" 
        component={Recuperar} 
        options={{ title: 'RECUPERAR CONTRASEÑA' }} 
      />
    </Stack.Navigator>
  );
}
