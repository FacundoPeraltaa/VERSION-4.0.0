import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import InfoAnimal from '../InfoAnimal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [movies, setMovies] = useContext(MovieContext)
  
  const route = useRoute();
  const {animal} = route.params;
  const {animales} = route.params;
  const {usuario} = route.params;

  const hoy = new Date();
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false
  });

  const validate = values => {
    const errors = {}
    if (values.erp) {
      let erp = values.erp.trim();
      erp = erp.replace('.', ',');
      if (erp.length) {
        if (isNaN(erp)) {
          errors.erp = "El eRP DEBE SER NUMERICO";
        } else {
          if (erp.length != 15) {
            errors.erp = "El eRP DEBE SER DE 15 DIGITOS";
          } else {
            //chequeo que no exista

            const filtro = animales.filter(animal => {
              return (
                animal.erp == erp
              )
            });
            if (filtro.length > 0) errors.erp = "EL eRP YA SE ENCUENTRA ASIGNADO";
          }
        }
      }
    } else {
      errors.erp = "DEBE INGRESAR UN eRP";
    }
    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formErp = useFormik({
    initialValues: {

      erp: '',

    },
    validate,
    onSubmit: datos => guardar(datos)
  });


  function guardar(datos) {
      let detalle='eRP anterior: '+animal.erp;
    try {
      let objIndex = movies.findIndex((obj => obj.id == animal.id));
      const copia = [...movies]
      copia[objIndex].erp= datos.erp
      setMovies(copia)
      firebase.db.collection('animal').doc(animal.id).update({ erp: datos.erp });
      setAlerta({
        show: true,
        titulo: '¡ ATENCIÓN !',
        mensaje: 'eRP CAMBIADO CON ÉXITO ',
        color: '#3AD577',
        vuelve:true
      });

      firebase.db.collection('animal').doc(animal.id).collection('eventos').add({
        fecha: hoy,
        tipo: 'Cambio eRP',
        detalle: detalle,
        usuario: usuario
      })

    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUDO CAMBIAR EL eRP',
        color: '#DD6B55',
        vuelve:false
      });

    }

  }

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : null}
    keyboardVerticalOffset={100} // Prueba con diferentes valores

  >
    <InfoAnimal
      animal={animal}
      datos='erp'
    />
    <View style={styles.form}>
      <View>
        <Text style={styles.texto}>Nuevo Botón (eRP) :</Text>
        <TextInput
          style={styles.entrada}
          onChangeText={formErp.handleChange('erp')}
          value={formErp.values.erp.toString()} // Convierte a Cadena ( String )
          keyboardType="numeric"
        />
        {formErp.errors.erp ? <Text style={styles.error}>{formErp.errors.erp}</Text> : null}
      </View>
    </View>
    <Button
      style={styles.boton}
      title="  ACEPTAR"
      icon={Platform.OS === 'ios' ? (
        <Icon
          name="check-square"
          size={35}
          color="white"
        />
      ) : null}
      onPress={formErp.handleSubmit}
    />
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
        if (alerta.vuelve == true) {
          navigation.popToTop();
        }
      }}
    />
  </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',


  },
  form: {
    flex: 5,
    backgroundColor: '#e1e8ee',
    flexDirection: 'column',
    paddingTop: 5,

  },
  fecha: {
    width: wp('100%'),
    padding: 5,
    height: 50
  },
  lista: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    height: 50

  },
  texto: {
    marginLeft: 5,
    marginTop: 10,

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

  entrada: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    paddingLeft: 5

  },
  boton: {
    margin: 5,

  }

});