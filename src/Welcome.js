// WelcomeScreen.js
import React from 'react';
import { View, Text, Image } from 'react-native';

const WelcomeScreen = () => {
  return (
    <View  style={{ flex: 1 ,justifyContent: 'center', alignItems: 'center'}}    >
      <Image
        source={require('../assets/splash.png')} // Asegúrate de que la ruta a la imagen sea correcta
        style={{ flex:  1, resizeMode: 'contain',  height: 250, backgroundColor: '#1b8aa5' }} 
      />
    </View>
  );
};

export default WelcomeScreen;
