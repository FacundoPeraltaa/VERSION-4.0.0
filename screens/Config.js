import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View,  Text, FlatList, ActivityIndicator, Image, Linking} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64';
import SelectTambo from './SelectTambo';
import { connect } from 'react-redux';
import { selectTambo } from '../src/reducers/tambo';
import AwesomeAlert from 'react-native-awesome-alerts';



const Config = ({ navigation, tambo, selectTambo }) => {
//export default Config = ({ navigation, tambo, selectTambo }) => {
  const [showTambos, setShowTambos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  useEffect(() => {

    if (!global.btoa) {
      global.btoa = encode;
    }

  }, []);

  const opciones = [
    { id: '0', nombre: 'CAMBIO DE BOTÓN ELECTRÓNICO ( eRP )', accion: 'CambiarBotonElec' },
    { id: '1', nombre: 'ANIMALES', accion: 'Animales' },
    { id: '2', nombre: 'MONITOR DE INGRESO', accion: 'MonitorIngreso' },
    { id: '3', nombre: 'CONTROL DE INGRESO', accion: 'ControlDeIngreso' },
    { id: '4', nombre: 'CONTROL LECHERO', accion: 'ControlLechero' },
    { id: '5', nombre: 'MANTENIMIENTO DE COMEDEROS', accion: 'MantdeComederos' },
    { id: '6', nombre: 'CALIBRACIÓN DE COMEDEROS', accion: 'Calibracion' },
    { id: '7', nombre: 'SELECCIONAR TAMBO', accion: '' },
   // { id: '8', nombre: 'PLATAFORMA WEB', accion: '' },
    { id: '9', nombre: 'AYUDA', accion: 'Ayuda' },
    { id: '10', nombre: 'PREFERENCIAS', accion: 'Preferencias' },
    { id: '11', nombre: 'CERRAR SESION', accion: ' ' },
     
  ]; 

  function ListItemOpciones({ data, tambo }) {

    const { nombre, id, accion } = data;

    const funcionalidad = () => {
      if (id == '7') {

        setShowTambos(true);
      } else if (id == '11') {

        setAlerta({
          show: true,
          titulo: '¡ ATENCIÓN ! ',
          mensaje: '¿ DESEA CERRAR SESION ?',
          color: '#3AD577'
        });

       

      }
      else if (id == 8){
        Linking.openURL("https://farmerin-navarro.web.app/")
      }
      else {
        navigation.push(accion, {
          tambo: tambo
        })
      }
    }

    return (
      <TouchableOpacity onPress={funcionalidad}>
        <View style={styles.containerList}>
          <Text style={styles.textList}> {nombre} </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (


    <View style={styles.container}>
      {loading ?
        <ActivityIndicator size="large" color='#1b829b' />
        :
        <>
          <View style={styles.tambo}>
            <Text style={styles.textTambo}>{tambo.nombre}</Text>
          </View>
          <View style={styles.list}>
            <FlatList
              data={opciones}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ListItemOpciones
                  data={item}
                  tambo={tambo}
                />
              )
              }
              ItemSeparatorComponent={() => <Separator />}
            />

          </View>
          <View>
          <Text style={styles.textVersion} > Version 3.2.6 </Text>
          <Text style={styles.textVersion} > Farmerin Division S.A. - &copy; 2020 </Text>
          </View>


        </>
      }
      {showTambos && <SelectTambo setShowTambos={setShowTambos} showTambos={showTambos} selectTambo={selectTambo} />}
      <AwesomeAlert
        show={alerta.show}
        showProgress={false}
        title={alerta.titulo}
        message={alerta.mensaje}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="CANCELAR"
        confirmText="ACEPTAR"
        confirmButtonColor={alerta.color}
        cancelButtonColor={'#DD6B55'}
        onCancelPressed={() => {
          setAlerta({ show: false })
        }}
        onConfirmPressed={() => {
          setAlerta({ show: false })
          AsyncStorage.removeItem('usuario');
          AsyncStorage.removeItem('nombre');
          navigation.navigate('MenuSesion');
        }}
      />
    </View>

  );
}

const Separator = () => <View style={{ flex: 1, height: 1, backgroundColor: '#399dad' }}></View>

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#e1e8ee',

  },

  tambo: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#c7db35',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    justifyContent: 'center'
  },
  textTambo: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    textTransform:"uppercase"

  },
  list: {
    flex: 8,

  },
  abajo: {
    flex: 2,
    alignItems: 'center',

  },


  text: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold'
  },
  text1: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: -5
  },
  text2: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10

  },

  center: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',

  },
  header: {

    backgroundColor: '#2980B9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15

  },
  content: {
    backgroundColor: '#e1e8ee',
    borderWidth: 1,
    borderColor: 'white',
    margin: 20,
    marginTop: hp('25%'),
    borderRadius: 15,
    height: hp('35%'),

  },
  logo: {
    marginTop: 0,
    height: hp('10%'),
    width: wp('70%'),

  },
  containerList: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  textList: {
    fontSize: 15,
    color: '#00111C',
  },
  textVersion: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: "uppercase",
    fontWeight: "bold",
    color: '#002742',
  },
});

const mapStateToProps = state => {
  return { tambo: state.tambo }
}
const mapDispatchToProps = dispatch => ({
  selectTambo: (tambo) => dispatch(selectTambo(tambo))
})
export default connect(mapStateToProps, mapDispatchToProps)(Config);