import { createStackNavigator } from '@react-navigation/stack';
import ConfigScreen from '../screens/Config';
import ErpScreen from '../screens/Erp/Erp';
import CambiarErpScreen from '../screens/Erp/CambiarErp';
import TolvaScreen from '../screens/Tolvas/Tolva';
import LadoTolvaScreen from '../screens/Tolvas/LadoTolva';
import CalibracionScreen from '../screens/Calibracion/Calibracion';
import ControlScreen from '../screens/Control/Control';
import ListarControlesScreen from '../screens/Control/ListarControles';
import AllAnimales from '../screens/AllAnimales/AllAnimales';
import Ayuda from "../screens/Ayuda/Ayuda";
import Monitor from '../screens/Monitor';
import Preferencias from '../screens/Preferencias/Preferencias';
import Logueos from '../screens/Preferencias/Logueos';
import Notificaciones from '../screens/Preferencias/Notificaciones';
import Grafico from '../screens/GraficoIngreso/IngresoControl';
import React from 'react';

const Stack = createStackNavigator();

const screenOptions = {
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#4cb050',
    shadowOffset: { width: 1, height: 1 },
  },
  headerTitleAlign: 'center',
};

export default function MyConfigStack() {
  return (
    <Stack.Navigator
      initialRouteName="ListaConfig"
      screenOptions={screenOptions}
    >
      <Stack.Screen
        name="ListaConfig"
        component={ConfigScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'CONFIGURACIÓN',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CambiarBotonElec"
        component={ErpScreen}
        options={{
          headerBackTitle: 'Volver',
          title: "CAMBIAR BOTON (eRP)",
        }}
      />
      <Stack.Screen
        name="CambiarBoton"
        component={CambiarErpScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'Cambiar Boton (eRP)',
        }}
      />
      <Stack.Screen
        name="MantdeComederos"
        component={TolvaScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'MANTENIMIENTO COMEDEROS',
        }}
      />
      <Stack.Screen
        name="Preferencias"
        component={Preferencias}
        options={{
          headerBackTitle: 'Volver',
          title: 'PREFERENCIAS',
        }}
      />
      <Stack.Screen
        name="LadoTolva"
        component={LadoTolvaScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'COMEDEROS',
        }}
      />
      <Stack.Screen
        name="ControlDeIngreso"
        component={Grafico}
        options={{
          headerBackTitle: 'Volver',
          title: 'CONTROL DE INGRESO',
        }}
      />
      <Stack.Screen
        name="Calibracion"
        component={CalibracionScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'CALIBRACION DE COMEDEROS',
        }}
      />
      <Stack.Screen
        name="ControlLechero"
        component={ControlScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'CONTROL LECHERO',
        }}
      />
      <Stack.Screen
        name="Animales"
        component={AllAnimales}
        options={{
          headerBackTitle: 'Volver',
          title: 'ANIMALES',
        }}
      />
      <Stack.Screen
        name="MonitorIngreso"
        component={Monitor}
        options={{
          headerBackTitle: 'Volver',
          title: 'MONITOR DE INGRESO',
        }}
      />
      <Stack.Screen
        name="Ayuda"
        component={Ayuda}
        options={{
          headerBackTitle: 'Volver',
          title: 'AYUDA',
        }}
      />
      <Stack.Screen
        name="Logueos"
        component={Logueos}
        options={{
          headerBackTitle: 'Volver',
          title: 'Logueos',
        }}
      />
      <Stack.Screen
        name="Notificaciones"
        component={Notificaciones}
        options={{
          headerBackTitle: 'Volver',
          title: 'NOTIFICACION',
        }}
      />
      <Stack.Screen
        name="ControlLecheros"
        component={ListarControlesScreen}
        options={{
          headerBackTitle: 'Volver',
          title: 'CONTROLES LECHEROS',
        }}
      />
    </Stack.Navigator>
  );
}
