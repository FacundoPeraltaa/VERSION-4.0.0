import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import SecadoScreen from '../screens/Secado/Secado';
import PartoScreen from '../screens/Parto/Parto';
import RegistrarPartoScreen from '../screens/Parto/RegistrarParto';
import RegistrarAbortoScreen from '../screens/Parto/RegistrarAborto';
import RechazoScreen from '../screens/Rechazo/Rechazo';
import RegistrarRechazoScreen from '../screens/Rechazo/RegistrarRechazo';
import TactoScreen from '../screens/Tacto/Tacto';
import CeloScreen from '../screens/Celo/Celo';
import RegistrarCeloScreen from '../screens/Celo/RegistrarCelo';
import ServicioScreen from '../screens/Servicio/Servicio';
import RegistrarServicioScreen from '../screens/Servicio/RegistrarServicio';
import BajaScreen from '../screens/Baja/Baja';
import RegistrarBajaScreen from '../screens/Baja/RegistrarBaja';
import TratamientoScreen from '../screens/Tratamiento/Tratamiento';
import RegistrarTratamientoScreen from '../screens/Tratamiento/RegistrarTratamiento';
import ProduccionScreen from '../screens/Produccion/Produccion';
import RegistrarProduccionScreen from '../screens/Produccion/RegistrarProduccion';
import RecepcionScreen from '../screens/Recepcion/Recepcion';
import RegistrarRecepcionScreen from '../screens/Recepcion/RegistrarRecepcion';
import AltaScreen from '../screens/Alta/Alta';
import AltaVaquillonaScreen from '../screens/AltaVaquillona/AltaVaquillona';

const Stack = createStackNavigator();

const headerOptions = {
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#4cb050',
    shadowOffset: { width: 1, height: 1 },
    elevation: 3,
    borderBottomWidth: 1,
  },
  headerTitleAlign: 'center',
  headerBackTitle: 'Volver',
};

export default function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="MenuEventos"
      screenOptions={headerOptions}
    >
      <Stack.Screen
        name="MenuEventos"
        component={HomeScreen}
        options={{ headerTitle: 'EVENTOS', headerShown: false }}
      />
      <Stack.Screen
        name="Secado"
        component={SecadoScreen}
        options={{ headerTitle: 'SECADO' }}
      />
      <Stack.Screen
        name="Parto"
        component={PartoScreen}
        options={{ headerTitle: 'PARTO' }}
      />
      <Stack.Screen
        name="RegistrarParto"
        component={RegistrarPartoScreen}
        options={{ headerTitle: 'REGISTRAR PARTO' }}
      />
      <Stack.Screen
        name="RegistrarAborto"
        component={RegistrarAbortoScreen}
        options={{ headerTitle: 'REGISTRAR ABORTO' }}
      />
      <Stack.Screen
        name="Rechazo"
        component={RechazoScreen}
        options={{ headerTitle: 'RECHAZO' }}
      />
      <Stack.Screen
        name="RegistrarRechazo"
        component={RegistrarRechazoScreen}
        options={{ headerTitle: 'REGISTRAR RECHAZO' }}
      />
      <Stack.Screen
        name="Tacto"
        component={TactoScreen}
        options={{ headerTitle: 'TACTO' }}
      />
      <Stack.Screen
        name="Celo"
        component={CeloScreen}
        options={{ headerTitle: 'CELO' }}
      />
      <Stack.Screen
        name="RegistrarCelo"
        component={RegistrarCeloScreen}
        options={{ headerTitle: 'REGISTRAR CELO' }}
      />
      <Stack.Screen
        name="Servicio"
        component={ServicioScreen}
        options={{ headerTitle: 'SERVICIO' }}
      />
      <Stack.Screen
        name="RegistrarServicio"
        component={RegistrarServicioScreen}
        options={{ headerTitle: 'REGISTRAR SERVICIO' }}
      />
      <Stack.Screen
        name="Baja"
        component={BajaScreen}
        options={{ headerTitle: 'BAJA' }}
      />
      <Stack.Screen
        name="RegistrarBaja"
        component={RegistrarBajaScreen}
        options={{ headerTitle: 'REGISTRAR BAJA' }}
      />
      <Stack.Screen
        name="Tratamiento"
        component={TratamientoScreen}
        options={{ headerTitle: 'TRATAMIENTO' }}
      />
      <Stack.Screen
        name="RegistrarTratamiento"
        component={RegistrarTratamientoScreen}
        options={{ headerTitle: 'REGISTRAR TRATAMIENTO' }}
      />
      <Stack.Screen
        name="Produccion"
        component={ProduccionScreen}
        options={{ headerTitle: 'PRODUCCION' }}
      />
      <Stack.Screen
        name="RegistrarProduccion"
        component={RegistrarProduccionScreen}
        options={{ headerTitle: 'REGISTRAR PRODUCCION' }}
      />
      <Stack.Screen
        name="Recepcion"
        component={RecepcionScreen}
        options={{ headerTitle: 'RECEPCION' }}
      />
      <Stack.Screen
        name="RegistrarRecepcion"
        component={RegistrarRecepcionScreen}
        options={{ headerTitle: 'REGISTRAR RECEPCION' }}
      />
      <Stack.Screen
        name="Alta"
        component={AltaScreen}
        options={{ headerTitle: 'ALTA' }}
      />
      <Stack.Screen
        name="AltaVaquillona"
        component={AltaVaquillonaScreen}
        options={{ headerTitle: 'ALTA VAQUILLONA' }}
      />
    </Stack.Navigator>
  );
}
