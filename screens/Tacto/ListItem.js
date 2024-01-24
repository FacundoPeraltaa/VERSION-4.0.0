import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns'

export default function ListItem({ data, animales, guardarAnimales }) {

  const { id, rp, estrep, fservicio, diasPre, pre, categoria, estpro, diasServicio, nservicio } = data;
  const [siglas, guardarSiglas] = useState({
    cat: 'VC',
    prod: 'S',
    rep: 'V'
  })
  const [servicio, setServicio] = useState('');

  useEffect(() => {

    if (fservicio) {
      const s = format(new Date(fservicio), 'dd/MM/yy');
      setServicio(s);
    } else {
      setServicio(' ')
    }

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



  function cancelConfirmar() {
    if (pre) {
      const animalesAct = animales.map(a => {
        // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
        if (a.id === id) {
          a.pre = false;
        }
        // Si no es el elemento que deseamos actualizar lo regresamos tal como está
        return a;
      });

      guardarAnimales(animalesAct);
    }
  }

  function confirmar() {
      if (!pre) {
        const animalesAct = animales.map(a => {
          // Revisamos que la llave recibida coincida con el elemento que queremos actualizar
          if (a.id === id) {
            a.pre = true;
            //console.log(a.id);
          }
          // Si no es el elemento que deseamos actualizar lo regresamos tal como está
          return a;
        });

        guardarAnimales(animalesAct);

      }
  }

  return (
    <>
      {pre ?
        <TouchableOpacity style={styles.container2} onPress={cancelConfirmar}>
          <Text style={styles.text2}>RP: {rp} - ULT.SERV: {servicio} - {diasServicio} DIAS</Text>
        </TouchableOpacity> 
        :
        <TouchableOpacity onPress={confirmar}>
                <View style={styles.container} onPress={confirmar}>
            <Text style={styles.text}>RP: {rp} - ULT.SERV: {servicio} - {diasServicio} DIAS</Text>
            </View>
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
  },
  leftAction2: {
    backgroundColor: '#F39C12',
    justifyContent: 'center',
    flex: 1,
  },
});