import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput,TouchableHighlight } from 'react-native';
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
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [fecha, setFecha] = useState(new Date());

  const route = useRoute();
  const {animal} = route.params;
  const {usuario} = route.params;

  const options = [
    { key: 1, value: 'Infertil', label: 'INFERTIL' },
    { key: 2, value: 'Baja Producción', label: 'BAJA PRODUCCION' },
    { key: 3, value: 'Enf. Sanitarias', label: 'ENF. SANITARIAS' },
    { key: 4, value: 'Fin de vida Útil', label: 'FIN VIDA UTIL' },
    { key: 5, value: 'Mastitis', label: 'MASTITIS' },
    { key: 6, value: 'Patas', label: 'PATAS' },
    { key: 7, value: 'Ubre', label: 'UBRE' },
    { key: 8, value: 'Otras causas', label: 'OTRAS CAUSAS' },
  ];

  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false
  });

  const validate = values => {

    const errors = {}
    if (!values.obs.length && (values.motivo == 'Otras causas')) {
      errors.obs = "DEBE INGRESAR UNA OBSERVACION"
    }
    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formRechazo = useFormik({
    initialValues: {
      fecha: new Date(),
      motivo: 'Infertil',
      obs: ''
    },
    validate,
    onSubmit: datos => guardar(datos)
  });




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
      fstring = format(datos.fecha, 'yyyy-MM-dd');
      fdate = datos.fecha;

    }

    let detalle = datos.motivo;
    if (datos.obs.length) detalle = detalle + ': ' + datos.obs;
    try {

      //firebase.db.collection('animal').doc(animal.id).update({ estpro: 'rechazo' });
      firebase.db.collection('animal').doc(animal.id).collection('eventos').add({
        fecha: fecha,
        tipo: 'Rechazo',
        detalle: detalle,
        usuario: usuario
      })
      setAlerta({
        show: true,
        titulo: '¡ ATENCIÓN !',
        mensaje: 'RECHAZO REGISTRADO CON ÉXITO',
        color: '#3AD577',
        vuelve: true
      });

    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUEDE REGISTRAR EL RECHAZO',
        color: '#DD6B55'
      });
    }

  }



  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false); 
    setFecha(currentDate);
    formRechazo.handleChange('fecha')
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
          <Text style={styles.texto}>MOTIVO:</Text>

          <ModalSelector
            data={options}
            onValueChange={formRechazo.handleChange('motivo')}
            value={formRechazo.values.motivo}
            placeholder={{}} // Ajusta el marcador de posición si es necesario
            cancelButtonAccessibilityLabel={'Cancelar'}
            initValue="SELECCIONA UN MOTIVO"
            style={{backgroundColor: '#FDFFFF', }}
          />
          <Text></Text>
          <Text style={styles.texto}>OBSERVACIONES:</Text>
          <TextInput
            style={styles.entrada}
            onChangeText={formRechazo.handleChange('obs')}
          />
          {formRechazo.errors.obs ? <Text style={styles.error}>{formRechazo.errors.obs}</Text> : null}
        </View>

      </View>
      <Button
        title="  ACEPTAR"
        icon={
          <Icon
            name="check-square"
            size={35}
            color="white"
          />
        }
        onPress={formRechazo.handleSubmit}
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
        cancelText="No, cancel"
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