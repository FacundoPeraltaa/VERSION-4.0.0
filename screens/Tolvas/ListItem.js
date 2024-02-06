import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function ListItem({ data, host,racionMotor }) {

  const { Sector, Orden, SumaRaciones, MantTolva, IdModbus, IdMotor, kgMantenimiento } = data;
  const [estado, setEstado] = useState('REVISADO');
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  useEffect(() => {

    if ((SumaRaciones - MantTolva) > kgMantenimiento) setEstado('MANTENIMIENTO');
   
  }, []);

  async function mover() {

    const url = 'http://' + host + '/moverMotor/' + IdModbus + '&' + IdMotor+'&'+racionMotor;
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
        titulo: '¡ATENCIÓN!',
        mensaje: t[0].mensaje,
        color: '#3AD577'
      });

    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO SE PUEDE CONECTAR AL TAMBO',
        color: '#DD6B55'
      });
    }
  };

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
        titulo: '¡ATENCIÓN!',
        mensaje: t[0].mensaje,
        color: '#3AD577'
      });
   


    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO SE PUEDE CONECTAR AL TAMBO',
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
            color="#3390FF"
          />
        }
        onPress={mover}
      />

      {(estado == 'MANTENIMIENTO') ?
        <Pressable

          onPress={setRevisado}
        >

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
        cancelText="No, cancel"
        confirmText="ACEPTAR"
        confirmButtonColor={alerta.color}
        onCancelPressed={() => {
          setAlerta({ show: false })
        }}
        onConfirmPressed={() => {
          setAlerta({ show: false })
        }}
      />

    </View>

  )
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
    color: "#f194ff",
  },
  boton2: {
    backgroundColor: "#ff8000",
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center'

  },
  revisada: {
    backgroundColor: '#62CD89',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 3,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center'

  },

});