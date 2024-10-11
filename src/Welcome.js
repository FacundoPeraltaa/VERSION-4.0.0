import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  useEffect(() => {
    const hideSplash = async () => {
      // Mantener la pantalla de inicio mientras se cargan los recursos
      await SplashScreen.preventAutoHideAsync();
      setTimeout(() => {
        SplashScreen.hideAsync(); // Ocultar la pantalla de inicio después de 3 segundos
      }, 3000);
    };
    hideSplash();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logolargo2.png')} style={styles.image} />
      {/* Agregar el loader debajo del texto */}
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    marginTop: 20,
    color: '#000',
  },
  loader: {
    marginTop: 30,
  },
});
