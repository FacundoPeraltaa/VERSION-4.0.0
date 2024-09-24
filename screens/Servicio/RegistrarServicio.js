import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import InfoAnimal from '../InfoAnimal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firebase from '../../database/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { format } from 'date-fns';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';
import RNPickerSelect from 'react-native-picker-select';

export default ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [movies, setMovies, trata, torosx] = useContext(MovieContext);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const route = useRoute();
  const { animal, tambo, usuario } = route.params;

  const [formValues, setFormValues] = useState({
    tipo: '',
  });

  const handleChange = fieldName => value => {
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
    obtenerTratamientos();
    obtenerToros();
  }, []);

  const validate = values => {
    const errors = {};
    return errors;
  };

  const formServicio = useFormik({
    initialValues: {
      fecha: new Date(),
      tratamiento: '',
      toro: 'Robo',
      tipo: 'Convencional',
      obs: ''
    },
    validate,
    onSubmit: datos => guardar(datos)
  });

  function obtenerTratamientos() {
    const filtrado = trata.filter(e => e.tipo === "servicio");

    filtrado.forEach(doc => {
      let tr = {
        key: doc.id,
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
    const tipof = typeof datos.fecha;
    let fstring;
    let fdate;
    if (tipof == 'string') {
      let parts = datos.fecha.split('/');
      fstring = `${parts[2]}-${parts[1]}-${parts[0]}`;
      let fs = `${fstring}T04:00:00`;
      fdate = new Date(fs);
    } else {
      fstring = format(fecha, 'yyyy-MM-dd');
      fdate = datos.fecha;
    }

    const detalle = `Toro: ${datos.toro} / Tipo: ${datos.tipo} / Tratamiento: ${datos.tratamiento} / Obs: ${datos.obs}`;
    const serv = animal.nservicio;
    let estadorepro = isEnabled ? "preñada" : "vacia";
    const an = {
      fservicio: fstring,
      nservicio: serv + 1,
      celo: false,
      estrep: estadorepro
    };

    try {
      let objIndex = movies.findIndex(obj => obj.id == animal.id);
      const copia = [...movies];
      const obj = copia[objIndex];
      const nuevo = { ...obj, ...an };
      copia[objIndex] = nuevo;
      setMovies(copia);
      console.log(nuevo);
      firebase.db.collection('animal').doc(animal.id).update(an);
      firebase.db.collection('animal').doc(animal.id).collection('eventos').add({
        fecha: fecha,
        tipo: 'Servicio',
        detalle: detalle,
        usuario: usuario
      });
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
    setShow(false);
    setFecha(date);
    formServicio.handleChange('fecha');
  }

  const handleVer = () => {
    setShow(true);
  };

  const texto = format(fecha, 'yyyy-MM-dd');

  return (
    <View style={styles.container}>
      <InfoAnimal
        animal={animal}
        datos='servicio'
      />
      <View style={styles.formContainer}>
        <ScrollView>
          <Text style={styles.label}>FECHA:</Text>
          <TouchableOpacity style={styles.calendario} onPress={handleVer}>
            <Text style={styles.textoCalendar}>{texto}</Text>
          </TouchableOpacity>
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
                  borderColor: '#1b829b',
                  borderWidth: 1,
                  borderRadius: 10,
                  backgroundColor: '#ffffff'
                }
              }}
            />
          )}
          <View>
            <Text style={styles.label}>TRATAMIENTO:</Text>
            <RNPickerSelect
              items={tratamientoOptions}
              onValueChange={formServicio.handleChange('tratamiento')}
              value={formServicio.values.tratamiento}
              placeholder={{
                label: 'SELECCIONAR TRATAMIENTO',
                value: null,
                color: '#9EA0A4',
              }}
              style={styles.pickerSelectStyles}
            />
          </View>
          <View>
            <Text style={styles.label}>TORO:</Text>
            <RNPickerSelect
              items={toros}
              onValueChange={formServicio.handleChange('toro')}
              value={formServicio.values.toro}
              placeholder={{
                label: 'SELECCIONAR TORO',
                value: null,
                color: '#9EA0A4',
              }}
              style={styles.pickerSelectStyles}
            />
          </View>
          <View>
            <Text style={styles.label}>TIPO SEMEN:</Text>
            <RNPickerSelect
              items={tipo}
              onValueChange={formServicio.handleChange('tipo')}
              value={formServicio.values.tipo}
              placeholder={{
                label: 'SELECCIONAR TIPO DE SEMEN',
                value: null,
                color: '#9EA0A4',
              }}
              style={styles.pickerSelectStyles}
            />
          </View>
          <View>
            <Text style={styles.label}>OBSERVACIONES:</Text>
            <TextInput
              style={styles.entrada}
              onChangeText={formServicio.handleChange('obs')}
              value={formServicio.values.obs}
              multiline
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
        buttonStyle={styles.button}
        onPress={formServicio.handleSubmit}
      />
      <AwesomeAlert
        show={alerta.show}
        showProgress={false}
        title={alerta.titulo}
        message={alerta.mensaje}
        closeOnTouchOutside={false}
        showCancelButton={false}
        showConfirmButton={true}
        cancelText="No, cancelar"
        confirmText="ACEPTAR"
        confirmButtonColor={alerta.color}
        onCancelPressed={() => {
          setAlerta({ show: false });
        }}
        onConfirmPressed={() => {
          setAlerta({ show: false });
          if (alerta.vuelve) {
            navigation.pop();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e8ee',
  },
  formContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
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
  textocalendar: {
    textAlign: "center",
    fontSize: 16,
    color: '#333',
  },
  fecha: {
    width: '100%',
    padding: 5,
    height: 50,
  },
  entrada: {
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 10,
    height: 50,
  },
  pickerSelectStyles: {
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
  },
});
