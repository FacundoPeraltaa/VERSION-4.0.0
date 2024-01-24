import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

export default function InfoAnimal({ navigation, animal, datos }) {
  const { rp, estpro, estrep, categoria, diasPre, nservicio, diasServicio, erp } = animal;
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
  return (

    <View style={styles.container}>
      {datos == 'erp' ?
        <>
          <View>
            <Text style={styles.header}>RP: {rp} </Text>
          </View>
          <View>
            <Text style={styles.header}>eRP: {erp}</Text>
          </View>
        </>
        :
        datos == 'servicio' ?
          <>
            <View>
              <Text style={styles.header}>RP: {rp} - {siglas.cat}/{siglas.prod}/{siglas.rep} </Text>
            </View>
            <View>
              <Text style={styles.header}>DIAS ULT. SERV: {diasServicio} - N° SERV: {nservicio}</Text>
            </View>
          </>
          :
          <>
            <View>
              <Text style={styles.header}>RP: {rp} - {siglas.cat}/{siglas.prod}/{siglas.rep} </Text>
            </View>
            <View>
              <Text style={styles.header}>DIAS PREÑ: {diasPre}</Text>
            </View>
          </>

      }

    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7db35',
    borderBottomWidth: 1,
    borderBottomColor: 'white'

  },

  header: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
});