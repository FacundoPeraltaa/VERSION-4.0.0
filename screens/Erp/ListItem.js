import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

export default function ListItem({ data,cambiarErp}) {

  const { id, rp,erp } = data;
  const [estilo, setEstilo] = useState(15);



  return (
    <TouchableHighlight
      onPress={cambiarErp}
       
    >
      <View style={styles.container}>
        <Text style={styles.text}>RP: {rp}  - eRP: {erp} </Text>
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