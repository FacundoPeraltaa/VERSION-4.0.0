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
import VaquillonaScreen from '../screens/Vaquillona/Vaquillona';
import AltaVaquillonaScreen from '../screens/AltaVaquillona/AltaVaquillona';
import React from 'react';


const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="MenuEventos"
      screenOptions={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#B5CD00',
          shadowOffset: { width: 1, height: 1 },
          elevation: 3,
          borderBottomWidth: 1,
        },
      }}
    >
      
      <Stack.Screen name="MenuEventos" component={HomeScreen} options={{headerTitleAlign: 'center', headerTitle: 'EVENTOS', headerShown: false}}/>
      
      <Stack.Screen name="Secado" component={SecadoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'SECADO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Parto" component={PartoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'PARTO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarParto" component={RegistrarPartoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR PARTO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarAborto" component={RegistrarAbortoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR ABORTO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Rechazo" component={RechazoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'RECHAZO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarRechazo" component={RegistrarRechazoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR RECHAZO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Tacto" component={TactoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'TACTO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Celo" component={CeloScreen} options={ {headerTitleAlign: 'center', headerTitle: 'CELO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarCelo" component={RegistrarCeloScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR CELO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Servicio" component={ServicioScreen} options={ {headerTitleAlign: 'center', headerTitle: 'SERVICIO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarServicio" component={RegistrarServicioScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR SERVICIO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Baja" component={BajaScreen} options={ {headerTitleAlign: 'center', headerTitle: 'BAJA', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarBaja" component={RegistrarBajaScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR BAJA', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Tratamiento" component={TratamientoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'TRATAMIENTO', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarTratamiento" component={RegistrarTratamientoScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR TRATAMIENTO', headerBackTitle: 'Volver' }}/>

      <Stack.Screen name="Produccion" component={ProduccionScreen} options={ {headerTitleAlign: 'center', headerTitle: 'PRODUCCION', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarProduccion" component={RegistrarProduccionScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR PRODUCCION',  headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Recepcion" component={RecepcionScreen} options={ {headerTitleAlign: 'center', headerTitle: 'RECEPCION', headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="RegistrarRecepcion" component={RegistrarRecepcionScreen} options={ {headerTitleAlign: 'center', headerTitle: 'REGISTRAR RECEPCION',  headerBackTitle: 'Volver'}}/>

      <Stack.Screen name="Alta" component={AltaScreen} options={ {headerTitleAlign: 'center', headerTitle: 'ALTA'}}/>

      <Stack.Screen name="AltaVaquillona" component={AltaVaquillonaScreen} options={ {headerTitleAlign: 'center', headerTitle: 'ALTA VAQUILLONA',  headerBackTitle: 'Volver'}}/>
     
     
    </Stack.Navigator>

    
  );
}