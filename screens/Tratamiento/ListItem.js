import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

export default function ListItem({ data,registrarTratamiento}) {

  const { id, rp,fservicio,estrep,estpro,categoria,lactancia } = data;
  const [parto, setParto] = useState(false);
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

  



  return (
    <TouchableHighlight
      onPress={registrarTratamiento}
       

    >
      <View style={styles.container}>
        <Text style={styles.text}>RP: {rp} ({siglas.cat}/{siglas.prod}/{siglas.rep}) - LACT: {lactancia} </Text>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    color: '#070037'
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