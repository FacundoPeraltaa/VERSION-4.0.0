import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, ScrollView, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
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
  const [movies, setMovies] = useContext(MovieContext)
  const [fecha, setFecha] = useState(new Date());
  const [fecha2, setFecha2] = useState(new Date());
  const [fecha3, setFecha3] = useState(new Date());
  const [aviso, setAviso] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [texto2, setTexto2] = useState("-- / -- / --")
  const [texto3, setTexto3] = useState("-- / -- / --")

  const route = useRoute();
  const {tambo} = route.params;
  const {usuario} = route.params;

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve: false
  });

  const repOptions = [

    { key: 1, value: 'vacia', label: 'VACIA' },
    { key: 2,value: 'preñada', label: 'PREÑADA' }
  ];

  const prodOptions = [

    { key: 1,value: 'seca', label: 'SECA' },
    { key: 2,value: 'En Ordeñe', label: 'EN ORDEÑE' },
    { key: 3,value: 'Vq.p/servicio', label: 'VAQ. P/SERVICIO' }
  ];

  const validate = values => {
    const errors = {}

    //valida que el rp exita y no sea repetido
    if (values.rp) {

      //chequeo que no exista
      const rp = values.rp.toString().toLowerCase();
      const filtro = movies.filter(animal => {
        return (
          animal.rp.toString().toLowerCase() == rp
        )
      });
      if (filtro.length > 0) errors.rp = "EL RP YA SE ENCUENTRA ASIGNADO";


    } else {
      errors.rp = "INGRESE RP";
    }

    //valida que el erp tenga 15 digitos
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

            const filtro = movies.filter(animal => {
              return (
                animal.erp == erp
              )
            });
            if (filtro.length > 0) errors.erp = "EL eRP YA SE ENCUENTRA ASIGNADO";
          }
        }
      }
    }
    //Si está en ordeñe se debe ingresar la fecha de parto para los días de lactancia
    if ((values.estpro == 'En Ordeñe') && (!values.fparto)) {
      errors.fparto = "INGRESAR FECHA DE PARTO";
    }

    //Si está en ordeñe al menos debe tener una lactancia
    if ((values.estpro == 'En Ordeñe') && (values.lactancia == '0')) {
      errors.lactancia = "LACTANCIA NO PUEDE SER CERO";
    }
    //Si está en preñada se debe ingresar la fecha del ultimo servicio para los dias de preñez
    if ((values.estrep == 'preñada')) {
      setAviso(true);
    }

    //valida que tenga lactancia
    if (!values.lactancia) {
      errors.lactancia = "INGRESE LACTANCIA";
    } else {
      if (isNaN(values.lactancia)) {
        errors.lactancia = "REVISE LACTANCIA";
      } else {
        if (values.lactancia < 0 || values.lactancia > 15) {
          errors.lactancia = "REVISE LACTANCIA"
        }
      }
    }

    //valida que tenga uc
    if (!values.uc) {
      errors.uc = "INGRESE ULTIMO CONTROL";
    } else {
      if (isNaN(values.uc)) {
        errors.uc = "REVISE UC";
      } else {
        if (values.uc < 0 || values.uc > 80) {
          errors.uc = "REVISE UC"
        }
      }
    }

    //valida que tenga racion
    if (!values.racion) {
      errors.racion = "INGRESE RACION";
    } else {
      if (isNaN(values.racion)) {
        errors.racion = "REVISE RACION";
      } else {

        if (values.racion < 0 || values.racion > 20) {
          errors.racion = "REVISE RACION"
        }
      }
    }

    return errors
  }

  //La funcion validate debe estar declarada antes del form sino no funciona
  const formAlta = useFormik({
    initialValues: {
      fecha: new Date(),
      rp: '',
      erp: '',
      lactancia: "0",
      observaciones: '',
      estpro: 'seca',
      estrep: 'vacia',
      fparto: '',
      fservicio: '',
      racion: "8",
      uc: "0",
    },
    validate,
    onSubmit: datos => guardar(datos)
  });



/*
  function snapshotAnimal(snapshot) {
    const an = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }

    })
    guardarAnimales(an);
    setLoading(false);
  };
  */
  const guardarAnimal = (anim)=> {
      setMovies([...movies, anim])
  }
  async function guardar(datos) {
    setLoading(true);
    let parts;
    //Formatea fecha de ingreso
    const tipof = typeof datos.fecha;
    let fi;
    if (tipof == 'string') {
      parts = datos.fecha.split('/');
      fi = (parts[2]) + '-' + (parts[1]) + '-' + parts[0];
    } else {
      fi = format(datos.fecha, 'yyyy-MM-dd');
    }
    //formatea fecha de parto
    let fp = '';
    if (datos.fparto) {
      fp = datos.fparto
    }

    //formatea fecha de servicio y pone el nro de servicio
    let fs = '';
    let nservicio = 0;
    if (datos.fservicio) {
      fs = datos.fservicio
      nservicio = 1;
    }
    //formatea lactancia y determina categoria
    let lact = parseInt(datos.lactancia);
    let cat = 'Vaquillona';
    if (lact > 1) cat = 'Vaca';

    //formatea uc
    let uc = parseFloat(datos.uc);

    //formatea erp
    let erp = '';
    if (datos.erp) {
      erp = parseInt(datos.erp);
    }

    //formatea racion
    let racion = parseInt(datos.racion);

    let hoy = new Date();
    let ayer = new Date(Date.now() - 86400000);

    const animal = {
      ingreso: fi,
      idtambo: tambo.id,
      rp: datos.rp,
      erp: erp,
      lactancia: lact,
      observaciones: datos.observaciones,
      estpro: datos.estpro,
      estrep: datos.estrep,
      fparto: fp,
      fservicio: fs,
      categoria: cat,
      racion: racion,
      fracion: ayer,
      nservicio: nservicio,
      uc: uc,
      fuc: hoy,
      ca: 0,
      anorm: '',
      fbaja: '',
      mbaja: '',
      rodeo: 0,
      sugerido: 0
    }

    guardarAnimal(animal)
    firebase.db.collection('animal').add(animal).then(function (docRef) {
      guardarEvento(docRef.id, datos.observaciones);
    }).catch(error => {
      setAlerta({
        show: true,
        titulo: '¡ ERROR !',
        mensaje: 'NO SE PUDO REGISTRAR EL ANIMAL' + error,
        color: '#DD6B55'
      });
    });
    setAlerta({
      show: true,
      titulo: '¡ ATENCIÓN !',
      mensaje: 'ANIMAL REGISTRADO CON ÉXITO',
      color: '#3AD577',
      vuelve: true
    });

    setLoading(false);
  }

  function guardarEvento(id, obs) {
    let hoy = new Date();
    firebase.db.collection('animal').doc(id).collection('eventos').add({
      fecha: hoy,
      tipo: 'Alta',
      detalle: obs,
      usuario: usuario
    });
  }
  function borrarFservicio() {
    setTexto2("-- / -- / --");
  }
  function borrarFparto() {
    setTexto3("-- / -- / --");
  }
  function cambiarFecha(event, date) {
    const currentDate = date;
    setShow(false);
    setFecha(currentDate);
    formAlta.setFieldValue('fecha', currentDate);
  };

  function cambiarFecha2(event, date) {
    const currentDate = date;
    setShow2(false);
    setFecha2(currentDate);
    let stringfecha2 = format(currentDate, 'yyyy-MM-dd');
    setTexto2(stringfecha2);
    formAlta.setFieldValue('fservicio', stringfecha2);
  }

  function cambiarFecha3(event, date) {
    const currentDate = date;
    setShow3(false);
    setFecha3(currentDate);
    let stringfecha3 = format(currentDate, 'yyyy-MM-dd');
    setTexto3(stringfecha3);
    formAlta.setFieldValue('fparto', stringfecha3);
  };
  const handlever = () => {
    setShow(true);
  }
  const handlever2 = () => {
    setShow2(true);
  }
  const handlever3 = () => {
    setShow3(true);
  }
  let texto = format(fecha, 'yyyy-MM-dd');



  return (
    <View style={styles.container}>
      {loading ?
        <ActivityIndicator size="large" color='#1b829b' />
        :
        <View style={styles.form}>
          <ScrollView>
            <View>
              <Text style={styles.texto}>FECHA INGRESO:</Text>
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
                      borderColor: 'white',
                      borderRadius: 10,
                      backgroundColor: 'white',
                      borderColor: 'grey',
                      borderWidth: 1,
                    }
                  }}
                />
              )}

            </View>
            <View>
              <Text style={styles.texto}>RP:</Text>
              <TextInput
                style={styles.entrada}
                onChangeText={formAlta.handleChange('rp')}
                value={formAlta.values.rp}
              />
              {formAlta.errors.rp ? <Text style={styles.error}>{formAlta.errors.rp}</Text> : null}
            </View>
            <View>
              <Text style={styles.texto}>eRP:</Text>
              <TextInput
                style={styles.entrada}
                onChangeText={formAlta.handleChange('erp')}
                value={formAlta.values.erp}
                keyboardType="numeric"
              />
              {formAlta.errors.erp ? <Text style={styles.error}>{formAlta.errors.erp}</Text> : null}
            </View>

            <View>
              <Text style={styles.texto}>ESTADO REPRODUCTIVO:</Text>

              <ModalSelector
             data={repOptions}
             onValueChange={formAlta.handleChange('estrep')}
             value={formAlta.values.estrep}

             placeholder={{}}
             initValue="SELECCIONA ESTADO REPRODUCTIVO"
             style={{backgroundColor: '#FDFFFF', }}
              />
              {aviso ? <Text style={styles.error2}>RECUERDA INGRESAR LA FECHA DE SERVICIO</Text> : null}
            </View>
            <View>
              <Text style={styles.texto}>ULTIMO SERVICIO:</Text>
              <View style={styles.row}>
              <TouchableHighlight style={styles.calendario} onPress={handlever2}>
                <View 

                ><Text style={styles.textocalendar}>{texto2}</Text></View></TouchableHighlight>
              {show2 && (
                <DateTimePicker
                  placeholder="DD/MM/AAAA"
                  dateFormat="DD/MM/YYYY"
                  maximumDate={new Date()}
                  showIcon={true}
                  androidMode="spinner"
                  style={styles.fecha}
                  value={fecha2}
                  onChange={cambiarFecha2}
                  customStyles={{
                    dateInput: {
                      borderColor: 'white',
                      borderRadius: 10,
                      backgroundColor: 'white',
                      borderColor: 'grey',
                      borderWidth: 1,
                    }
                  }}
                />)}
              {texto2 !== "-- / -- / --" ?
                <Button
                  style={styles.botonBorrar}
                  type="clear"
                  icon={
                    <Icon
                      name="trash"
                      size={25}
                      color="red"
                    />
                  }
                  onPress={borrarFservicio}
                />
                :
                null
              }
              </View>
            </View>
            <View>
              <Text style={styles.texto}>ESTADO PRODUCTIVO:</Text>

              <ModalSelector
                data={prodOptions}
                onValueChange={formAlta.handleChange('estpro')}
                value={formAlta.values.estpro}

                placeholder={{}}
                initValue="SELECCIONA ESTADO PRODUCTIVO"
                style={{backgroundColor: '#FDFFFF', }}
              />

            </View>

            <Text style={styles.texto}>ULTIMO PARTO:</Text>

            <View style={styles.row}>
              <TouchableHighlight style={styles.calendario} onPress={handlever3}>
                <View

                ><Text style={styles.textocalendar}>{texto3}</Text></View></TouchableHighlight>
              {show3 && (
                <DateTimePicker
                  placeholder="DD/MM/AAAA"
                  dateFormat="DD/MM/YYYY"
                  maximumDate={new Date()}
                  showIcon={true}
                  androidMode="spinner"
                  style={styles.fecha}
                  value={fecha3}
                  onChange={cambiarFecha3}
                  customStyles={{
                    dateInput: {
                      borderColor: 'grey',
                      borderWidth: 1,
                      borderRadius: 10,
                      backgroundColor: 'white'
                    }
                  }}
                />)}
              {texto3 !== "-- / -- / --" ?
                <Button
                  style={styles.botonBorrar}
                  type="clear"
                  icon={
                    <Icon
                      name="trash"
                      size={25}
                      color="red"
                    />
                  }
                  onPress={borrarFparto}
                />
                :
                null
              }
            </View>
            <View>
              <Text style={styles.texto}>LACTANCIA:</Text>
              <TextInput
                style={styles.entrada}
                onChangeText={formAlta.handleChange('lactancia')}
                value={formAlta.values.lactancia}
                keyboardType="numeric"
              />
              {formAlta.errors.lactancia ? <Text style={styles.error}>{formAlta.errors.lactancia}</Text> : null}
            </View>
            <View>
              <Text style={styles.texto}>ULTIMO CONTROL(LTS):</Text>
              <TextInput
                style={styles.entrada}
                onChangeText={formAlta.handleChange('uc')}
                value={formAlta.values.uc}
                keyboardType="numeric"
              />
              {formAlta.errors.uc ? <Text style={styles.error}>{formAlta.errors.uc}</Text> : null}
            </View>
            <View>
              <Text style={styles.texto}>RACION(KGS):</Text>
              <TextInput
                style={styles.entrada}
                onChangeText={formAlta.handleChange('racion')}
                value={formAlta.values.racion}
                keyboardType="numeric"
              />
              {formAlta.errors.racion ? <Text style={styles.error}>{formAlta.errors.racion}</Text> : null}
            </View>
            <View>
              <Text style={styles.texto}>OBSERVACIONES:</Text>
              <TextInput
                style={styles.entrada}
                onChangeText={formAlta.handleChange('observaciones')}
                value={formAlta.values.observaciones}

              />
            </View>
            <Text></Text>
            {Object.entries(formAlta.errors).length !== 0 ? <Text style={styles.error}>REVISE LOS ERRORES</Text> : null}
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
              onPress={formAlta.handleSubmit}
            />
          </ScrollView>
        </View>
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

  },error2: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    fontSize: 13,
    borderRadius: 5,
    color: '#1434A4',
    backgroundColor: '#89CFF0',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#1434A4'

  },
  textocalendar: {
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
  row: {
    flexDirection: "row",
    alignItems: "center"
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

  },

});