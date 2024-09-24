import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Modal, FlatList, TextInput, TouchableHighlight } from 'react-native';
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
import RNPickerSelect from 'react-native-picker-select';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [fecha, setFecha] = useState(new Date());
  const [movies, setMovies,trata] = useContext(MovieContext)
  
  const route = useRoute();
  const {animal} = route.params;
  const {tambo} = route.params;


  const [show, setShow] = useState(false);

  const {usuario} = route.params;

  const [tratamientoOptions, setTratamientoOptios] = useState([{ value: '-', label: '' }]);
  const [options, setOptions] = useState([
    { value: 'Aborto', label: 'ABORTO' },
    { value: 'Aborto inicia lactancia', label: 'ABORTO INICIA LACTANCIA' },
  ]);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false
  });

  const formAborto = useFormik({
    initialValues: {
      fecha: new Date(),
      tipo: 'Aborto inicia lactancia',
      tratamiento: ''
    },
    onSubmit: datos => guardar(datos)
  });

  const validate = values => {
    const errors = {}
    return errors
  }

  useEffect(() => {

    if (animal.diasPre < 150) {
      formAborto.setFieldValue('tipo', 'Aborto');
      setOptions([
        { value: 'Aborto', label: 'ABORTO' }
        
      ])
    }
    //busca los tratamientos de abortos
    obtenerTratamientos();

  }, []);

  function obtenerTratamientos() {
    const filtrado = trata.filter(e => e.tipo === "tratamiento");
  
    filtrado.forEach(doc => {
      let tr = {
        key: doc.descripcion,  // Utiliza el id del documento como clave única
        value: doc.descripcion,
        label: doc.descripcion
      };
  
      setTratamientoOptios(tratamientoOptions => [...tratamientoOptions, tr]);
    });
  }

  const guardarAnimal = (anim)=> {
    setMovies([...movies, anim])
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
      fstring = format(datos.fecha, 'yyyy-MM-dd');
      fdate = datos.fecha;

    }

    //actualizar animal
    let cat = animal.categoria;
    let lact = parseInt(animal.lactancia);
    let estado = animal.estpro;

    //si inicia lactancia, aumento las mismas y paso a Ordeñe
    if (datos.tipo != 'Aborto') {
      lact++;
      estado = 'En Ordeñe';
      if (lact > 1) {
        cat = 'Vaca'
      } else {
        cat = 'Vaquillona';
      }
    }


    let an = {
      lactancia: lact,
      estpro: estado,
      estrep: 'vacia',
      fparto: fstring,
      fservicio: '',
      categoria: cat,
      nservicio: 0
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
        tipo: datos.tipo,
        detalle: datos.tratamiento,
        usuario: usuario
      })

      setAlerta({
        show: true,
        titulo: '¡ATENCION!',
        mensaje: 'ABORTO REGISTRADO CON ÉXITO ',
        color: '#3AD577',
        vuelve: true
      });

    } catch (error) {

      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUDO REGISTRAR EL ABORTO',
        color: '#DD6B55'
      });
    }

  }
  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false); 
    setFecha(currentDate);
    formAborto.handleChange('fecha')
  };
const handlever = ()=> {
  setShow(true);
}
let texto = format(fecha, 'yyyy-MM-dd');

  return (
    <View style={styles.container}>
    <InfoAnimal animal={animal} />
    <View style={styles.form}>
      <Text style={styles.texto}>FECHA:</Text>
      <TouchableHighlight style={styles.calendario} onPress={handlever} underlayColor="#ddd">
        <View>
          <Text style={styles.textocalendar}>{texto}</Text>
        </View>
      </TouchableHighlight>
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
              borderColor: '#d0d0d0',
              borderRadius: 12,
              backgroundColor: '#fff',
              borderWidth: 1
            }
          }}
        />
      )}
      <View>
        <Text style={styles.texto}>TIPO:</Text>
        <RNPickerSelect
          items={options}
          onValueChange={formAborto.handleChange('tipo')}
          value={formAborto.values.tipo}
          placeholder={{}}
          style={styles.pickerStyle}
        />
        <Text></Text>
        <Text style={styles.texto}>TRATAMIENTO:</Text>
        <RNPickerSelect
          items={tratamientoOptions}
          onValueChange={formAborto.handleChange('tratamiento')}
          value={formAborto.values.tratamiento}
          placeholder={{}}
          style={styles.pickerStyle}
        />
      </View>
    </View>
    <Button
      title="ACEPTAR"
      icon={
        <Icon
          name="check-square"
          size={35}
          color="#fff"
        />
      }
      buttonStyle={styles.button}
      onPress={formAborto.handleSubmit}
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
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  textocalendar: {
    textAlign: "center",
    fontSize: 16,
    color: '#333'
  },
  calendario: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
    width: wp('90%'),
    alignSelf: 'center',
    marginVertical: 10,
  },
  form: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  fecha: {
    width: '100%',
    marginTop: 10,
  },
  texto: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pickerStyle: {
    inputIOS: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      height: 50,
      borderColor: '#d0d0d0',
      borderWidth: 1,
      paddingHorizontal: 15,
      color: '#333',
      fontSize: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    inputAndroid: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      height: 50,
      borderColor: '#d0d0d0',
      borderWidth: 1,
      paddingHorizontal: 15,
      color: '#333',
      fontSize: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    placeholder: {
      color: '#9EA0A4',
    },
    iconContainer: {
      top: 10,
      right: 10,
    },
  },
  button: {
    backgroundColor: '#1b829b',
    borderRadius: 8,
    marginTop: 15,
  }

});