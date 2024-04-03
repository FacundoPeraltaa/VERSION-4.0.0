// WelcomeScreen.js
import React from 'react';
import { View, Text, Image } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View  style={{ flex: 1 ,justifyContent: 'center', alignItems: 'center'}}    >
      <Image
        source={require('../assets/NUEVOICONOBLANCO2.png')} // Asegúrate de que la ruta a la imagen sea correcta
        style={{ flex:  1, resizeMode: 'contain',  height: 250, backgroundColor: '#fefeff' }} 
      />
    </View>
  );
};

export default WelcomeScreen;
