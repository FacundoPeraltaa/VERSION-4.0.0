import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableHighlight, Switch } from 'react-native';
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
import { MovieContext } from "../Contexto"
import { useRoute } from '@react-navigation/core';
import RNPickerSelect from 'react-native-picker-select';


export default ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [movies, setMovies, trata, torosx] = useContext(MovieContext)

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const route = useRoute();
  const {animal} = route.params;
  const {tambo} = route.params;
  const {usuario} = route.params;

  const [formValues, setFormValues] = useState({
    tipo: '', // Inicializa el valor según tus necesidades
  });

  const handleChange = fieldName => value => {
    // Actualiza el estado del formulario con el nuevo valor
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };


  const [tratamientoOptions, setTratamientoOptios] = useState([{ value: '-', label: '' }]);
  const [toros, setToros] = useState([{ key: 1, value: 'Robo', label: 'ROBO' }]);
  const tipo = [
    { key: 1, value: 'Convencional', label: 'CONVENCIONAL' },
    { key: 2, value: 'Sexado', label: 'SEXADO' }
  ];
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false,
  });
  useEffect(() => {

    //busca los tratamientos
    obtenerTratamientos();

    //busca los toros
    obtenerToros();

  }, []);


  const validate = values => {

    const errors = {}
    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formServicio = useFormik({
    initialValues: {
      fecha: new Date(),
      tratamiento: '',
      toro: 'Robo',
      tipo: 'Convencional',
      obs: ''

    },
    validate,
    onSubmit: (datos) => guardar(datos)
  });

  function obtenerTratamientos() {
    const filtrado = trata.filter(e => e.tipo === "servicio");
  
    filtrado.forEach(doc => {
      let tr = {
        key: doc.id,  // Utiliza el id del documento como clave única
        value: doc.descripcion,
        label: doc.descripcion
      };
  
      setTratamientoOptios(tratamientoOptions => [...tratamientoOptions, tr]);
    });
  }


  function obtenerToros() {
    try {
      firebase.db.collection('macho').where('idtambo', '==', tambo.id).where('cat', '==', 'toro').get().then(snapshotToro)
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUEDEN OBTENER LOS TOROS',
        color: '#DD6B55'
      });
    }
  }

  function snapshotToro(snapshot) {
    snapshot.docs.map(doc => {
      let t = {
        key: doc.id,
        value: doc.data().hba,
        label: doc.data().hba
      };

      setToros(toros => [...toros, t]);
    });
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

    const detalle = 'Toro: ' + datos.toro + ' /Tipo: ' + datos.tipo + ' /Tratamiento: ' + datos.tratamiento + ' /Obs: ' + datos.obs;
    const serv = animal.nservicio;
    let estadorepro= ""
    if(isEnabled){
      estadorepro="preñada"
    }
    else {
      estadorepro = "vacia"
    };
    const an = {
      fservicio: fstring,
      nservicio: serv+1,
      celo: false,
      estrep: estadorepro
    }

    try {
      let objIndex = movies.findIndex((obj => obj.id == animal.id));
      const copia = [...movies]
      const obj = copia[objIndex]
      const nuevo = Object.assign({},obj, an)
      copia[objIndex]=nuevo
      setMovies(copia)
      console.log(nuevo)
      firebase.db.collection('animal').doc(animal.id).update(an);
      firebase.db.collection('animal').doc(animal.id).collection('eventos').add({
        fecha: fecha,
        tipo: 'Servicio',
        detalle: detalle,
        usuario: usuario
      })
      setAlerta({
        show: true,
        titulo: '¡ ATENCIÓN !',
        mensaje: 'SERVICIO REGISTRADO CON ÉXITO',
        color: '#3AD577',
        vuelve: true,
      });

    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUEDE REGISTRAR EL SERVICIO',
        color: '#DD6B55',
        vuelve: false
      });
    }

  }


  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false); 
    setFecha(currentDate);
    formServicio.handleChange('fecha')
  };
const handlever = ()=> {
  setShow(true);
}
let texto = format(fecha, 'yyyy-MM-dd');

  return (
    <View style={styles.container}>
      <InfoAnimal
        animal={animal}
        datos='servicio'
      />
      <View style={styles.switch}>
        <Text style={styles.switchTexto}>MOVER ANIMAL A PARTO SIN CONFIRMAR PREÑEZ</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
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
            <Text style={styles.texto}>TRATAMIENTO:</Text>
    
            <RNPickerSelect
              items={tratamientoOptions}
              onValueChange={formServicio.handleChange('tratamiento')}
              value={formServicio.values.tratamiento}

              placeholder={{
                label: 'SELECCIONAR TRATAMIENTO',
                value: null,
                color: '#9EA0A4',
              }}
              style={styles.pickerStyle}
            />

          </View>
          <View>
            <Text style={styles.texto}>TORO:</Text>
          
            <RNPickerSelect
              items={toros}
              onValueChange={formServicio.handleChange('toro')}
              value={formServicio.values.toro}

              placeholder={{
                label: 'SELECCIONAR TORO',
                value: null,
                color: '#9EA0A4',
              }}
              style={styles.pickerStyle}
            />

          </View>
          <View>
            <Text style={styles.texto}>TIPO SEMEN:</Text>
      
            <RNPickerSelect
              items={tipo}
              onValueChange={formServicio.handleChange('tipo')}
              value={formServicio.values.tipo}

              placeholder={{
                label: 'SELECCIONAR TIPO DE SEMEN',
                value: null,
                color: '#9EA0A4',
              }}
              style={styles.pickerStyle}
            />
           
          </View>
          <View>
            <Text style={styles.texto}>OBSERVACIONES:</Text>
            <TextInput
              style={styles.entrada}
              onChangeText={formServicio.handleChange('obs')}
              value={formServicio.values.obs}
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
        onPress={formServicio.handleSubmit}
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

            navigation.pop();
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
    fontSize: 14,
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
    backgroundColor: '#fdffff',
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    paddingLeft: 5

  },
  boton: {
    margin: 5
  },
switch: {
  backgroundColor: "#FAD623",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
},
switchTexto: {
  color: "white",
  fontWeight: "bold",
  paddingLeft: 5,
  fontSize: 13
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

},

});