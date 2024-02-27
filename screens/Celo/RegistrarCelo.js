import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import InfoAnimal from '../InfoAnimal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { format } from 'date-fns';
import AwesomeAlert from 'react-native-awesome-alerts';
import ModalSelector from 'react-native-modal-selector';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [fecha, setFecha] = useState(new Date());
  const [movies, setMovies, trata] = useContext(MovieContext)

  const route = useRoute();
  const {animal} = route.params;
  const {tambo} = route.params;
  const {usuario} = route.params;

  const [show, setShow] = useState(false);

  const [tratamientoOptions, setTratamientoOptios] = useState([{  value: '-', label: '' }]);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false
  });

  useEffect(() => {

    //busca los tratamientos
    obtenerTratamientos();

  }, []);


  const validate = values => {

    const errors = {}
    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formCelo = useFormik({
    initialValues: {
      fecha: new Date(),
      tratamiento: '',

    },
    validate,
    onSubmit: datos => guardar(datos)
  });

  function obtenerTratamientos() {
    const filtrado = trata.filter(e => {
      return (
        e.tipo == "tratamiento"
      )
    });
    filtrado.map(doc => {
      let tr = {
        value: doc.descripcion,
        label: doc.descripcion
      }

      setTratamientoOptios(tratamientoOptions => [...tratamientoOptions, tr]);
    })
  }


  function guardar(datos) {

    //Formatea fecha 
    const tipof = typeof datos.fecha;
    let fstring;
    let fdate;
    if (tipof == 'string') {
      let parts = datos.fecha.split('/');
      fstring = (parts[2]) + '-' + (parts[1]) + '-' + parts[0];
      let fs = fstring + 'T04:00:00';
      fdate = new Date(fs);
    } else {
      fstring = format(fecha, 'yyyy-MM-dd');
      fdate = datos.fecha;

    }


    const an = {
      celo: true
    }

    try {
      let objIndex = movies.findIndex((obj => obj.id == animal.id));
      const copia = [...movies]
      const obj = copia[objIndex]
      const nuevo = Object.assign({},obj, an)
      copia[objIndex]=nuevo
      setMovies(copia)
      firebase.db.collection('animal').doc(animal.id).update(an);
      firebase.db.collection('animal').doc(animal.id).collection('eventos').add({
        fecha: fecha,
        tipo: 'Celo',
        detalle: datos.tratamiento,
        usuario: usuario
      });
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: 'CELO REGISTRADO CON ÉXITO ',
        color: '#3AD577',
        vuelve: true
      });


    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO SE PUDO REGISTRAR EL CELO',
        color: '#DD6B55'
      });
    }

  }




  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false); 
    setFecha(currentDate);
    formCelo.handleChange('fecha')
  };
const handlever = ()=> {
  setShow(true);
}
let texto = format(fecha, 'yyyy-MM-dd');
  return (
    <View style={styles.container}>
      <InfoAnimal
        animal={animal}
      />
      <View style={styles.form}>
        <Text style={styles.texto}>FECHA:</Text>
        <TouchableHighlight style={styles.calendario} onPress={handlever}>
          <View 
          
          ><Text style={styles.textocalendar}>{texto}</Text></View></TouchableHighlight>
        {show && (
        <DateTimePicker
          placeholder="Fecha"
          dateFormat="DD/MM/YYYY"
          maximumDate={new Date()}
          showIcon={true}
          androidMode="spinner"
          style={styles.fecha}
          value={fecha}
          onChange={cambiarFecha}
          customStyles={{
            dateInput: {
              borderColor: 'grey',
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: 'white'
            }
          }}
        /> )}
        <View>
          <Text style={styles.texto}>TRATAMIENTO:</Text>
      
          <ModalSelector
           data={tratamientoOptions}
           onValueChange={formBaja.handleChange('tratamientos')}
           value={formBaja.values.motivo}
           placeholder={{}}
           cancelButtonAccessibilityLabel={'Cancelar'}
           initValue="SELECCIONA UN MOTIVO"
           style={{backgroundColor: '#FDFFFF', }}
          />

        </View>

      </View>
      <Button
        style={styles.boton}
        title="  ACEPTAR"
        icon={
          <Icon
            name="check-square"
            size={35}
            color="white"
          />
        }
        onPress={formCelo.handleSubmit}
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
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',


  },
  form: {
    flex: 6,
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
  textocalendar:{
    textAlign: "center"
  },
  calendario: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 5,
    width: 200,
   marginVertical: 10,
    marginLeft: 10
  },
  boton: {
    margin: 5
  },
  pickerStyle: {
    inputIOS: {
      marginLeft: 5,
      marginRight: 5,
      backgroundColor: 'white',
      height: 50
    },
    inputAndroid: {
      
      marginLeft: 5,
      marginRight: 5,
      backgroundColor: 'white',
      height: 50
    },

  }

});