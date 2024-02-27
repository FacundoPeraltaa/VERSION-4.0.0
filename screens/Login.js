import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firebase from '../database/firebase';
//import { signInWithEmailAndPassword } from "firebase/auth"
import Icon from 'react-native-vector-icons/FontAwesome'
import { useFormik } from 'formik';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PasswordInputText from 'react-native-hide-show-password-input';
import AwesomeAlert from 'react-native-awesome-alerts';
import { TouchableHighlight } from 'react-native-gesture-handler';

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
      errors.usuario = "DEBE INGRESAR UN USUARIO"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.usuario)) {
      errors.usuario = 'Formato incorrecto';
    }
    if (!values.clave) {
      errors.clave = "DEBE INGRESAR UNA CONTRASEÑA"
    }
    return errors
  }
  const forgotPassword = (Email) => {
    firebase.autenticacion.sendPasswordResetEmail(Email)
      .then(function (user) {
        setAlerta({
          show: true,
          titulo: '¡ATENCION!',
          mensaje: "TE HEMOS ENVIADO UN MAIL PARA RESTABLECER TU CONTRASEÑA, SI NO LO HAS RECIBIDO REVISA EN SPAM",
          color: '#DD6B55'
        })
      }).catch(function (e) {
        console.log(e)
      })
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formLogin = useFormik({
    initialValues: {
      usuario: '',
      clave: '',
    },
    validate,
    onSubmit: datos => Login(datos)
  });

  async function guardarUsuario(usuario, nombreUsuario) {
    try {
      await AsyncStorage.setItem('usuario', usuario);
      await AsyncStorage.setItem('nombre', nombreUsuario);
      navigation.navigate('EventosMenu');
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
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
          titulo: '¡ ERROR !',
          mensaje: "CORREO O CONTRASEÑA INCORRECTOS",
          color: '#DD6B55'
        })
        setLoading(false);
      });


  }

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
              <View>
              <TextInput
                style={styles.entrada}
                placeholder='Correo Electronico'
                placeholderTextColor= 'gray' 
                onChangeText={formLogin.handleChange('usuario')}
              />
              {formLogin.errors.usuario ? <Text style={styles.error}>{formLogin.errors.usuario}</Text> : null}
              </View>
              <PasswordInputText
                style={styles.clave}
                iconColor='grey'
                onChangeText={formLogin.handleChange('clave')}
                label={'Contraseña'}
              />
              {formLogin.errors.clave ? <Text style={styles.error}>{formLogin.errors.clave}</Text> : null}
              <Button
              title="INGRESAR"
              onPress={formLogin.handleSubmit}
              buttonStyle={{marginBottom: 20,height:50,marginTop:30,backgroundColor:'#1988a5'}}
              
            />
            <Button
              title="REGISTRARSE"
              onPress={()=>navigation.navigate('Registrar')}
              buttonStyle={{height:50, backgroundColor:'#1988a5'}}
            />
            <View style={{display:"flex", alignItems:"center", marginTop:10}}>
              <TouchableHighlight onPress={()=>navigation.navigate('Recuperar')}>
            <Text 
            style={{color:"gray",fontWeight:"bold", color:'00253D'}}>Olvidé mi contraseña</Text>
            </TouchableHighlight>
            </View>
            </View>
            <View >
            <Text style={styles.textVersion} > Version 3.2.7 </Text>
            <Text style={styles.textVersion} > Farmerin Division S.A. - &copy; 2020 </Text>
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
    margin: 75,
    alignSelf: 'center', 
  },

  entrada: {
    marginTop: 15,
    marginLeft: 5,
    paddingLeft: 5,
    marginRight: 5,
    height:40,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#B0BDB5',
  },
  clave: {
    marginTop: 20,
    marginLeft: 5,
    paddingLeft: 5,
    marginRight: 5,
    borderBottomWidth: 1,
    borderColor: '#B0BDB5',
  },
  contenedor:{
    display: 'flex',
    padding: 100,
  },
  textVersion: {
    backgroundColor: '#e1e8ee',
    fontSize: 10,
    textAlign: 'center',
    textTransform: "uppercase",
    fontWeight: "bold",
    color: '#00253E',
  },


});