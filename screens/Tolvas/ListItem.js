import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import firebase from '../../database/firebase';

export default function ListItem({ data, host, racionMotor, id }) {

  const { Sector, Orden, SumaRaciones, MantTolva, IdModbus, IdMotor, kgMantenimiento } = data;
  const [estado, setEstado] = useState('REVISADO');
  const [isOldVersion, setIsOldVersion] = useState(false); // Nuevo estado para controlar la versión
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  useEffect(() => {
    verificarVersionTambo(); // Verificar la versión cuando se monta el componente

    if ((SumaRaciones - MantTolva) > kgMantenimiento) {
      setEstado('MANTENIMIENTO');
    }
  }, []);

  // Nueva función para verificar la versión del tambo
  async function verificarVersionTambo() {
    try {
      const snapshot = await firebase.db.collection('tambo').doc(id).get();
      if (snapshot.exists) {
        const data = snapshot.data();
        if (data.version === 'old') {
          setIsOldVersion(true);
        }
      }
    } catch (error) {
      console.log('Error verificando versión del tambo:', error);
    }
  }

  // Modificación de la función mover
  async function mover() {
    const url = isOldVersion
      ? 'http://' + host + '/moverMotor/' + IdModbus + '&' + IdMotor + '&' + racionMotor
      : 'http://' + host + '/moverMotor/' + Sector + '&' + Orden + '&' + racionMotor;

    const login = 'farmerin';
    const password = 'Farmerin*2021';
    try {
      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const t = await api.json();
      setAlerta({
        show: true,
        titulo: 'Atención!',
        mensaje: t[0].mensaje,
        color: '#3AD577'
      });
    } catch (error) {
      setAlerta({
        show: true,
        titulo: 'Error!',
        mensaje: 'No se puede conectar al tambo',
        color: '#DD6B55'
      });
    }
  };

  console.log('ORDEN', Orden);
  console.log('IdModbus', IdModbus);
  console.log('SECTOR', Sector);
  console.log('Id Motor', IdMotor);
  console.log('Racion Motor', racionMotor);
  console.log('host', host);
  console.log('Datos del motor:', data); 


  async function setRevisado() {
    const url = 'http://' + host + '/limpiarTolva/' + Orden + '&' + Sector;

    const login = 'farmerin';
    const password = 'Farmerin*2021';
    try {
      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const t = await api.json();
      setEstado('REVISADO');
      setAlerta({
        show: true,
        titulo: 'Atención!',
        mensaje: t[0].mensaje,
        color: '#3AD577'
      });
    } catch (error) {
      setAlerta({
        show: true,
        titulo: 'Error!',
        mensaje: 'No se puede conectar al tambo',
        color: '#DD6B55'
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>MOTOR: {Orden} </Text>
      <Button
        title=" GIRAR MOTOR"
        style={styles.boton}
        type="outline"
        icon={
          <Icon
            name="refresh"
            size={30}
            color="#287fb9"
          />
        }
        onPress={mover}
      />

      {(estado == 'MANTENIMIENTO') ?
        <Pressable onPress={setRevisado}>
          <Text style={styles.boton2}>
            &nbsp;MANTENIMIENTO
          </Text>
        </Pressable>
        :
        <Text style={styles.revisada}>
          &nbsp;REVISADA
        </Text>
      }

      <AwesomeAlert
        show={alerta.show}
        showProgress={false}
        title={alerta.titulo}
        message={alerta.mensaje}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="ACEPTAR"
        confirmButtonColor={alerta.color}
        onConfirmPressed={() => {
          setAlerta({ show: false });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
    marginTop: 5,
    color: '#002C4B',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  boton: {
    marginTop: 5,
    marginBottom: 5,
    color: "#287fb9",
  },
  boton2: {
    backgroundColor: "#287fb9",
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  revisada: {
    backgroundColor: '#4db051',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
});
