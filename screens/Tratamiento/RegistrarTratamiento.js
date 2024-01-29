import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import InfoAnimal from '../InfoAnimal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ModalSelector from 'react-native-modal-selector';
import Icon from 'react-native-vector-icons/FontAwesome';
import { format } from 'date-fns';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';



export default ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [fecha, setFecha] = useState(new Date());

  const routeTratam = useRoute();
  const {animal} = routeTratam.params;
  const {usuario} = routeTratam.params;
  const {tratam} = routeTratam.params;

  const [tratamientos, setTratamientos] = useState([{ key: 1, value: '', label: '' }]);
  const [enfermedad, setEnfermedad] = useState([{ key: 1, value: '', label: '' }]);
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

  function obtenerTratamientos() {
    tratam.map(doc => {
      let tr = {
        key: doc.descripcion,
        value: doc.descripcion,
        label: doc.descripcion
      }

      if (doc.tipo == 'tratamiento') {
        setTratamientos(tratamientos => [...tratamientos, tr]);
      } else if (doc.tipo == 'enfermedad'){
        setEnfermedad(enfermedad => [...enfermedad, tr]);
      }
    })
  }

  const validate = values => {
    const errors = {}
    if (values.tratamiento == '') {
      errors.tratamiento = "DEBE SELECCIONAR UN TRATAMIENTO"
    }
    if (values.enfermedad == '') {
      errors.enfermedad = "DEBE SELECCIONAR UNA ENFERMEDAD"
    }
    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formTratamiento = useFormik({
    initialValues: {
      fecha: fecha,
      enfermedad: '',
      tratamiento: '',
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
      fstring = format(fecha, 'yyyy-MM-dd');
      fdate = datos.fecha;
      console.log('ESTO TIRO', fdate)

    }

    let detalle = 'Enfermedad: ' + datos.enfermedad + ' /Tratamiento: ' + datos.tratamiento + ' /Obs: ' + datos.obs;
    try {

      firebase.db.collection('animal').doc(animal.id).collection('eventos').add({
        fecha: fecha,
        tipo: 'Tratamiento',
        detalle: detalle,
        usuario: usuario
      
      })
      setAlerta({
        show: true,
        titulo: '¡ ATENCIÓN !',
        mensaje: 'TRATAMIENTO REGISTRADO CON ÉXITO',
        color: '#3AD577',
        vuelve: true,
      });
      console.log('EXITO', detalle)

    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUEDE REGISTRAR EL TRATAMIENTO',
        color: '#DD6B55'
      });
      console.log('ERROR', error)
    }



  }

  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false); 
    setFecha(currentDate);
    formTratamiento.handleChange('fecha')
  };
const handlever = ()=> {
  setShow(true);
}
console.log('TRATAM', formTratamiento)
let texto = format(fecha, 'yyyy-MM-dd');

return (
  <View style={styles.container}>
    <InfoAnimal
      animal={animal}
    />

    <View style={styles.form}>
      <ScrollView>
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
          <Text style={styles.texto}>ENFERMEDAD:</Text>
     
          <ModalSelector
            data={enfermedad}
            onValueChange={formTratamiento.handleChange('enfermedad')}
            value={formTratamiento.values.enfermedad}
            placeholder={{}} // Ajusta el marcador de posición si es necesario
            cancelButtonAccessibilityLabel={'Cancelar'}
            initValue="SELECCIONA UNA ENFERMEDAD"
            style={{backgroundColor: '#FDFFFF', }}
          />
          {formTratamiento.errors.enfermedad ? <Text style={styles.error}>{formTratamiento.errors.enfermedad}</Text> : null}
        </View>
        <View>
          <Text style={styles.texto}>TRATAMIENTO:</Text>
      
          <ModalSelector
            data={tratamientos}
            onValueChange={formTratamiento.handleChange('tratamiento')}
            value={formTratamiento.values.tratamiento}
            placeholder={{}}
            cancelButtonAccessibilityLabel={'Cancelar'}
            initValue="SELECCIONA UN TRATRAMIENTO"
            style={{backgroundColor: '#FDFFFF', }}
          />
          {formTratamiento.errors.tratamiento ? <Text style={styles.error}>{formTratamiento.errors.tratamiento}</Text> : null}
        </View>
        <View>
          <Text style={styles.texto}>OBSERVACIONES:</Text>
          <TextInput
            style={styles.entrada}
            onChangeText={formTratamiento.handleChange('obs')}
            value={formTratamiento.values.obs}
          />

        </View>
      </ScrollView>
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
      onPress={formTratamiento.handleSubmit}
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
    margin: 5
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
  },


});