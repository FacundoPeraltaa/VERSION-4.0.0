import React, { useState,useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ListItem({ data, guardarAnimales, animales}) {

  const { rp,estrep,estpro,categoria,diasPre,celar, id } = data;
  const [siglas, guardarSiglas] =useState({
    cat:'VC',
    prod: 'S',
    rep: 'V'
  })

  useEffect(() => {

    let c='VC';
    let p='S';
    let r='V';

    if (categoria!='Vaca') c='VQ';
    if (estpro!='seca') p='O';
    if (estrep!='vacia') r='P'

    guardarSiglas({
      cat:c,
      prod: p,
      rep: r
    })
      
  }, []);

  function cancelCelo() {
    if (celar) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.celar = false;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);
    }
  }

  function celo() {

    if (!celar) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.celar = true;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);

    }
  }
  return (
    <>
    {celar ?
    <TouchableOpacity onPress={cancelCelo} style={styles.containerCelo}>
        <Text style={styles.text2}>RP: {rp} ({siglas.cat}/{siglas.prod}/{siglas.rep}) - DIAS PREÑEZ: {diasPre} </Text>
    </TouchableOpacity>
    :
            <TouchableOpacity style={styles.container} onPress={celo}>
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
  containerCelo: {
    backgroundColor: '#249E31',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    color: '#070037'
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
  },

});