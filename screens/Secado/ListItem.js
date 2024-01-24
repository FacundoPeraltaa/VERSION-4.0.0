import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListItem({ data, animales, guardarAnimales }) {

  const { id, rp, estrep, fservicio, diasPre, secar, categoria, estpro } = data;
  const [siglas, guardarSiglas] = useState({
    cat: 'VC',
    prod: 'S',
    rep: 'V'
  })

  useEffect(() => {

    let c = 'VC';
    let p = 'S';
    let r = 'V';

    if (categoria != 'Vaca') c = 'VQ';
    if (estpro != 'seca') p = 'O';
    if (estrep != 'vacia') r = 'P'

    guardarSiglas({
      cat: c,
      prod: p,
      rep: r
    })


  }, []);




  function cancelSecado() {
    if (secar) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.secar = false;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);
    }
  }

  function secado() {

    if (!secar) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.secar = true;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);

    }
  }

  return (
    <>
      {secar ?
        <TouchableOpacity style={styles.containerSecar} onPress={cancelSecado}>
          <Text style={styles.textSecar}>SECAR - RP: {rp}</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.container} onPress={secado}>
          <Text style={styles.text}>RP: {rp} ({siglas.cat}/{siglas.prod}/{siglas.rep}) - DIAS PREÑEZ: {diasPre} </Text>
        </TouchableOpacity>

      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  containerSecar: {
    backgroundColor: '#249E31',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    color: '#2980B9'
  },
  textSecar: {
    fontSize: 16,
    color: '#FFF',
  },

});