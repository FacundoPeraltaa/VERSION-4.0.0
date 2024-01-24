import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns'

export default function ListItem({ data, animales, guardarAnimales }) {

  const { id, rp,cambiar,ingreso } = data;
  const [nacim,setNacim]=useState('');
  
  useEffect(() => {

    if (ingreso){
      const n = format(new Date(ingreso+'T00:00:00.00-03:00'), 'dd/MM/yy');
      //const n =new Date(ingreso).toUTCString(); 
      setNacim(n);
    }else{
      setNacim('-')
    }

      
  }, []);

  function cancelCambio() {
    if (cambio) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.cambiar = false;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);
    }
  }

  function cambio() {
    if (!cambiar) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.cambiar = true;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);

    }
  }

  return (
    <>
    {cambiar?
      <TouchableOpacity style={styles.container2} onPress={cancelCambio}>
      <Text style={styles.text2}>RP: {rp}  - NACIMIENTO: {nacim} </Text>
    </TouchableOpacity>
    :
    <TouchableOpacity onPress={cambio} >
      <View style={styles.container} onPress={cambio}>
        <Text style={styles.text}>RP: {rp}  - NACIMIENTO: {nacim} </Text>
      </View>
    </TouchableOpacity>}
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  container2: {
    backgroundColor: '#249E31',
    paddingHorizontal: 10,
    paddingVertical: 15
  },
  text: {
    fontSize: 16,
    color: '#2980B9'
  },
  text2: {
    fontSize: 16,
    color: '#ffff'
  },
  leftAction: {
    backgroundColor: '#249E31',
    justifyContent: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#FFF',
    padding: 15,
  }
});