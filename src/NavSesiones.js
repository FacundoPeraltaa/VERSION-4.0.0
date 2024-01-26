import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import Recuperar from '../screens/Recuperar';
import Register from '../screens/Register';

import React from 'react';


const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#1889a4',
          shadowOffset: { width: 1, height: 1 },
          elevation: 3,
          borderBottomWidth: 1,
          borderBottomColor: 'white',
        },
      }}
    >
     <Stack.Screen 
     name="MenuSesion" 
     component={LoginScreen} 
     options={{title: ' INICIAR SESION ', 
     headerTitleAlign: 'center' 
     }} 
     />
      
      <Stack.Screen 
      name="Registrar" 
      component={Register} 
      options={{ title: 'REGISTRARSE', 
      headerTitleAlign: 'center'  
      }}
      />

      <Stack.Screen 
      name="Recuperar" 
      component={Recuperar} 
      options={{ title: 'RECUPERAR CONTRASEÑA', 
      headerTitleAlign: 'center' 
      }}
      />
      
    </Stack.Navigator>
  );
}

