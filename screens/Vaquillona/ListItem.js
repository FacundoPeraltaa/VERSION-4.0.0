import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


export default function ListItem({ data, funcion }) {

  const { nombre } = data;


  return (
    <TouchableOpacity onPress={funcion }>
      <View style={styles.container}>
        <Text style={styles.text}> {nombre} </Text>
      </View>
    </TouchableOpacity>
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
    color:'#2980B9',

    
  },
 
});