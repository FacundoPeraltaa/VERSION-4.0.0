import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function ListItem({ data,cria,setCria }) {

  const { id, rp,sexo,trat,peso } = data;

  function LeftActions(progress, dragX) {

    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    return (
      <View style={styles.leftAction}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>Borrar Cria - RP: {rp}</Animated.Text>
      </View>
    );
  }

  function borrarCria(){
    const filtro = cria.filter(c => {
      return (
        c.id!=id
      )
    });
    setCria(filtro);
  }

  return (
    <Swipeable
      renderLeftActions={LeftActions}
      onSwipeableLeftOpen={borrarCria}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Sexo: {sexo} - RP: {rp} - kg: {peso}- {trat} </Text>
      </View>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',

    paddingHorizontal:10,
    paddingVertical: 15,
  },
  text: {
    fontSize: 15,
    color:'#000'
  },
  leftAction: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    flex: 1,
  },

  actionText: {
    fontSize: 15,
    color: '#FFF',
    padding: 10,
  },

});