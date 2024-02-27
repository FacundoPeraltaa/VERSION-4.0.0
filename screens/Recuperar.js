import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firebase from '../database/firebase';
//import { signInWithEmailAndPassword } from "firebase/auth"
import AwesomeAlert from 'react-native-awesome-alerts';

export default ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [mailo, setMailo] = useState("");

  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });
  const validate = values => {

    const errors = {}
    if (!values.usuario) {
      errors.usuario = "DEBE INGRESAR UN USUARIO"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.usuario)) {
      errors.usuario = 'Formato incorrecto';
    }
    if (!values.clave) {
      errors.clave = "DEBE INGRESAR UNA CLAVE"
    }
    return errors
  }
  const forgotPassword = async () => {
  await firebase.autenticacion.sendPasswordResetEmail(mailo)
      .then(function (user) {
        setAlerta({
          show: true,
          titulo: '¡ATENCIÓN! ',
          mensaje: "TE HEMOS ENVIADO UN MAIL PARA RESTABLECER TU CONTRASEÑA, SI NO LO HAS RECIBIDO REVISA EN SPAM",
          color: '#399dad'
        })
      }).catch(function (e) {
        setAlerta({
          show: true,
          titulo: '¡ATENCIÓN!',
          mensaje: "EL CORREO INGRESADO NO SE ENCUENTRA REGISTRADO EN FARMERIN",
          color: 'red'
        })      })
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
const handleChange =(e)=>{
setMailo(e)}

  return (
    <View style={styles.container}>
      <>
        {loading ?
          <ActivityIndicator size="large" color='#1b829b' />
          :
          <>
            <View style={styles.form}>
              <Image
                style={styles.logo}
                source={require('../assets/logolargo2.png')}
              />

              <TextInput
                style={styles.entrada}
                placeholder='Correo Electronico'
                onChangeText={handleChange}
              />

              <Button
              title="ENVIAR MAIL DE RECUPERACIÓN"
              onPress={forgotPassword}
              buttonStyle={{marginBottom: 20,height:50,marginTop:30, backgroundColor:'#96A400'}}

            />
            </View>
          </>
        }
        <AwesomeAlert
          show={alerta.show}
          showProgress={false}
          title={alerta.titulo}
          message={alerta.mensaje}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText="No, cancelar"
          confirmText="ACEPTAR"
          confirmButtonTextStyle={{
            fontSize:20,
            textAlign:"center",         
          }}
          titleStyle={{fontSize:26}}
          messageStyle={{fontSize:18, textAlign:"center"}}
          confirmButtonColor={alerta.color}
          onCancelPressed={() => {
            setAlerta({ show: false })
          }}
          onConfirmPressed={() => {
            setAlerta({ show: false })
            navigation.navigate('MenuInicio')
          }}
        />
      </>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',


  },
  form: {
    flex: 1,
    backgroundColor: '#e1e8ee',
    flexDirection: 'column',
    paddingTop: 5,

  },
  header: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#399dad'
  },
  error: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 13,
    borderRadius: 5,
    color: 'red',
    backgroundColor: 'pink',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'red'

  },

  logo: {
    height: wp('20%'),
    width: wp('80%'),
    margin: 80,
    alignSelf: 'center', 
  },

  entrada: {
    marginTop: 15,
    marginLeft: 5,
    paddingLeft: 5,
    marginRight: 5,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#B0BDB5'
  },
  clave: {
    marginTop: 20,
    marginLeft: 5,
    paddingLeft: 5,
    marginRight: 5,
  },

});