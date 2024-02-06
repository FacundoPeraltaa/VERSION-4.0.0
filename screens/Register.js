import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firebase from '../database/firebase';
// import { signInWithEmailAndPassword } from "firebase/auth"
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordInputText from 'react-native-hide-show-password-input';
import AwesomeAlert from 'react-native-awesome-alerts';

export default ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });
  const validate = values => {

    const errors = {}
    if (!values.usuario) {
      errors.usuario = "DEBE INGRESAR UN CORREO ELECTRONICO"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.usuario)) {
      errors.usuario = 'Formato incorrecto';
    }
    else if(!values.nombre) {
      errors.nombre = "DEBE INGRESAR UN NOMBRE"
    }
    if (!values.clave) {
      errors.clave = "DEBE INGRESAR UNA CONTRASEÑA"
    }
    return errors
  }


  //La funcion validate debe estar declarada antes del form sino no funciona
  const formLogin = useFormik({
    initialValues: {
      nombre: '',
      usuario: '',
      clave: '',
    },
    validate,
    onSubmit: datos => Registrar(datos)
  });
  async function guardarUsuario(usuario, nombreUsuario) {
    try {
      await AsyncStorage.setItem('usuario', usuario);
      await AsyncStorage.setItem('nombre', nombreUsuario);
      navigation.navigate('CONFIGURACION');
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: error,
        color: '#DD6B55'
      })
    }
  }
  async function guardarUsuario(usuario, nombreUsuario) {
    try {
      await AsyncStorage.setItem('usuario', usuario);
      await AsyncStorage.setItem('nombre', nombreUsuario);
      navigation.navigate('CONFIGURACION');
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: error,
        color: '#DD6B55'
      })
    }
  }
  async function Login(datos) {
    setLoading(true);
    const usuario1 = datos.usuario;
    const clave = datos.clave;

    console.log(usuario1);
    console.log(clave);


    await firebase.autenticacion.signInWithEmailAndPassword(usuario1, clave).then((userCredential) => {
      //signInWithEmailAndPassword(autenticacion, user, clave).then(() => {
      // Signed in

      const user = userCredential.user;
      const usuario = user.uid;
      const nombreUsuario = user.displayName;
      guardarUsuario(usuario, nombreUsuario);

      //console.log('ccccc')

    })
      .catch((error) => {

        setAlerta({
          show: true,
          titulo: '¡ERROR!',
          mensaje: error.message + usuario1 + clave,
          color: '#DD6B55'
        })
        setLoading(false);
      });


  }
  async function Registrar(datos) {
    setLoading(true);
    const email = datos.usuario
    const password = datos.clave
    const nombre = datos.nombre
    const nuevoUsuario = await firebase.autenticacion.createUserWithEmailAndPassword(email, password).then(
      (res)=>{
        res.user.updateProfile({
          displayName:nombre
        })
      }
      ).then(()=>navigation.navigate('EVENTOS'))
  };

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
                placeholder='Nombre Completo'
                onChangeText={formLogin.handleChange('nombre')}
                placeholderTextColor= 'gray' 

              />
              {formLogin.errors.nombre ? <Text style={styles.error}>{formLogin.errors.nombre}</Text> : null}
              <TextInput
                style={styles.entrada}
                placeholder='Correo Electronico'
                onChangeText={formLogin.handleChange('usuario')}
                placeholderTextColor= 'gray' 

              />
              {formLogin.errors.usuario ? <Text style={styles.error}>{formLogin.errors.usuario}</Text> : null}

              <PasswordInputText
                style={styles.clave}
                iconColor='grey'
                onChangeText={formLogin.handleChange('clave')}
                label={'Contraseña'}
              />
              {formLogin.errors.clave ? <Text style={styles.error}>{formLogin.errors.clave}</Text> : null}
              <Button
                title="REGISTRARSE"
                onPress={formLogin.handleSubmit}
                buttonStyle={{ marginBottom: 20, height: 50, marginTop: 30, backgroundColor:'#96A400' }}
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
          confirmButtonColor={alerta.color}
          onCancelPressed={() => {
            setAlerta({ show: false })
          }}
          onConfirmPressed={() => {
            setAlerta({ show: false })
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
    margin: 35,
    alignSelf: 'center',  
  },

  entrada: {
    marginTop: 45,
    marginLeft: 5,
    paddingLeft: 5,
    marginRight: 5,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#B0BDB5',
    height:40,
  },
  clave: {
    marginTop: 20,
    marginLeft: 5,
    paddingLeft: 5,
    marginRight: 5,

  },

});