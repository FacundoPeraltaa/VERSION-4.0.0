import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import firebase from '../database/firebase';
import AwesomeAlert from 'react-native-awesome-alerts';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esta importación

export default ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [mailo, setMailo] = useState("");
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  const handleChange = (e) => {
    setMailo(e);
  };

  const forgotPassword = async () => {
    setLoading(true);
    try {
      await firebase.autenticacion.sendPasswordResetEmail(mailo);
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: "TE HEMOS ENVIADO UN MAIL PARA RESTABLECER TU CONTRASEÑA, SI NO LO HAS RECIBIDO REVISA EN SPAM",
        color: '#399dad'
      });
    } catch (e) {
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: "EL CORREO INGRESADO NO SE ENCUENTRA REGISTRADO EN FARMERIN",
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color='#1b829b' />
      ) : (
        <View style={styles.form}>
          <Image
            style={styles.logo}
            source={require('../assets/logolargo2.png')}
          />
          <TextInput
            style={styles.input}
            placeholder='Correo Electrónico'
            onChangeText={handleChange}
            value={mailo}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <Button
            title="ENVIAR MAIL DE RECUPERACIÓN"
            onPress={forgotPassword}
            buttonStyle={styles.button}
          />
        </View>
      )}
      <AwesomeAlert
        show={alerta.show}
        showProgress={false}
        title={alerta.titulo}
        message={alerta.mensaje}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="ACEPTAR"
        confirmButtonColor={alerta.color}
        onConfirmPressed={() => {
          setAlerta({ show: false });
          navigation.navigate('MenuInicio');
        }}
        confirmButtonTextStyle={styles.alertButtonText}
        titleStyle={styles.alertTitle}
        messageStyle={styles.alertMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  form: {
    backgroundColor: '#e1e8ee',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  logo: {
    width: wp('80%'),
    height: wp('20%'),
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#212121',
    borderColor: '#B0BDB5',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4cb050',
    borderRadius: 8,
    height: 50,
    width: '100%',
  },
  alertButtonText: {
    fontSize: 20,
    textAlign: "center",
  },
  alertTitle: {
    fontSize: 26,
  },
  alertMessage: {
    fontSize: 18,
    textAlign: "center",
  },
});
