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
    backgroundColor: '#ffffff', // Fondo blanco para los elementos
    borderRadius: 15, // Bordes redondeados
    padding: 15, // Espacio interno
    marginBottom: 1, // Espacio entre elementos
    shadowColor: '#000', // Sombra para darle profundidad
    shadowOffset: { width: 0, height: 5 }, // Offset de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 10, // Difusión de la sombra
    elevation: 5, // Elevación en Android
    borderWidth: 1, // Borde definido
    borderColor: '#e0e0e0', // Color del borde
  },
  containerCelo: {
    backgroundColor: '#4db150', // Fondo blanco para los elementos
    borderRadius: 15, // Bordes redondeados
    padding: 15, // Espacio interno
    marginBottom: 1, // Espacio entre elementos
    shadowColor: '#000', // Sombra para darle profundidad
    shadowOffset: { width: 0, height: 5 }, // Offset de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 10, // Difusión de la sombra
    elevation: 5, // Elevación en Android
    borderWidth: 1, // Borde definido
    borderColor: '#e0e0e0', // Color del borde
  },
  text: {
    fontSize: 16,
    color: '#333', // Color oscuro para el texto
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