import React, { useState, useEffect, useContext } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import RNPickerSelect from 'react-native-picker-select';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [fecha, setFecha] = useState(new Date());
  const [movies, setMovies, motivosx] = useContext(MovieContext)

  const route = useRoute();
  const {animal} = route.params;
  const {usuario} = route.params;
  const {tambo} = route.params;

  const [tambos, setTambos] = useState([{ value: '', label: 'OTRO' }]);
  const [motivos, setMotivos] = useState([{  value: '', label: '' }]);
  const [show, setShow] = useState(false);

  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false
  });

  useEffect(() => {

    //busca los tambos y motivos de baja
    obtenerTambos();
    obtenerMotivos();

  }, []);


  const validate = values => {
    const errors = {}
    if (!values.motivo){
      errors.motivo = "INGRESE UN MOTIVO DE BAJA"
    }
    if ((values.motivo == 'Transferencia') && (values.tambo == '0') && (values.nombreTambo == '')) {
      errors.nombreTambo = "INGRESE EL NOMBRE DEL TAMBO"
    }
    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formBaja = useFormik({
    initialValues: {
      fecha: new Date(),
      motivo: 'Muerte',
      tambo: '0',
      nombreTambo: '',

    },
    validate,
    onSubmit: datos => guardar(datos)
  });

  async function obtenerTambos() {

    try {
      AsyncStorage.getItem('usuario').then((keyValue) => {
        try {
          firebase.db.collection('tambo').where('usuarios', 'array-contains', keyValue).orderBy('nombre', 'desc').onSnapshot(snapshotTambo);
        } catch (error) {
          setAlerta({
            show: true,
            titulo: '¡ ERROR !',
            mensaje: 'AL RECUPERAR LOS TAMBOS ASOCIADOS AL USUARIO',
            color: '#DD6B55'
          });

        }
      });
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'AL RECUPERAR LOS TAMBOS ASOCIADOS AL USUARIO',
        color: '#DD6B55'
      });

    }
  }

  function snapshotTambo(snapshot) {
    snapshot.docs.map(doc => {
      let t = {
        value: doc.id,
        label: doc.data().nombre
      }

      setTambos(tambos => [...tambos, t]);

    })

  }



  function obtenerMotivos() {
    const motiv = motivosx.filter(e => {
      return (
        e.tipo == "baja"
      )
    }
    )

    motiv.map(doc => {
      let tr = {
        value: doc.descripcion,
        label: doc.descripcion
      }

      setMotivos(motivos => [...motivos, tr]);


    })

  };


  function guardar(datos) {

    let detalle = 'Motivo: ' + datos.motivo;
    let an;
    let tipo='Baja';

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

    //Si no es transferida
    if (datos.motivo != 'Transferencia') {
      an = {
        fbaja: fstring,
        mbaja: datos.motivo
      }

    } else {
      //si es transferida a un tambo ajeno
      if (datos.tambo == '0') {
        an = {
          fbaja: fstring,
          mbaja: datos.motivo
        }
        detalle = detalle + ' / Tambo: ' + datos.nombreTambo
        //Si es tranferida a un tambo propio
      } else {
        tipo='Alta';
        an = { idtambo: datos.tambo };
      }

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
        tipo: tipo,
        detalle: detalle,
        usuario: usuario
      });
      setAlerta({
        show: true,
        titulo: '¡ATENCION!',
        mensaje: 'BAJA REGISTRADA CON ÉXITO ',
        color: '#3AD577',
        vuelve: true
      });

    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'AL REGISTRAR LA BAJA' + error,
        color: '#DD6B55'
      });


    }

  }
  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false); 
    setFecha(currentDate);
    formBaja.handleChange('fecha')
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

          <RNPickerSelect
              items={motivos}
              onValueChange={formBaja.handleChange('motivo')}
              value={formBaja.values.motivo}

              placeholder={{
                label: 'SELECCIONAR MOTIVO',
                value: null,
                color: '#9EA0A4',
              }}
              style={{
                inputIOS: styles.pickerStyle,
                inputAndroid: styles.pickerStyle,
                placeholder: {
                  color: '#9EA0A4',
                },
              }}
              pickerContainerStyle={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 10,
              }}
            />

        </View>
        
        {
        formBaja.errors.motivo ? <Text style={styles.error}>{formBaja.errors.motivo}</Text> : null}
        
        {(formBaja.values.motivo == 'Transferencia') && 
          <View>
            <Text style={styles.texto}>TAMBO:</Text>
          
            <RNPickerSelect
              items={tambos}
              onValueChange={formBaja.handleChange('tambo')}
              value={formBaja.values.tambo}

              placeholder={{
                label: 'SELECCIONAR TAMBO',
                value: null,
                color: '#9EA0A4',
              }}
              style={{
                inputIOS: styles.pickerStyle,
                inputAndroid: styles.pickerStyle,
                placeholder: {
                  color: '#9EA0A4',
                },
              }}
              pickerContainerStyle={{
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ccc',
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 10,
              }}
            />
          </View>



        }
        {((formBaja.values.motivo == 'Transferencia') && (formBaja.values.tambo == '0')) &&
          <View>
            <Text style={styles.texto}>NOMBRE:</Text>
            <TextInput
              style={styles.entrada}
              onChangeText={formBaja.handleChange('nombreTambo')}
              value={formBaja.values.nombreTambo}
            />

          </View>
        }
        {formBaja.errors.nombreTambo ? <Text style={styles.error}>{formBaja.errors.nombreTambo}</Text> : null}
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
        onPress={formBaja.handleSubmit}
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