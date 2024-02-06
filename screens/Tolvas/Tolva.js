import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';
import { encode } from 'base-64'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {

  const route = useRoute();
  const {tambo} = route.params;

  const { id, host } = tambo;

  const [tolvasDer, guardarTolvasDer] = useState([]);
  const [tolvasIzq, guardarTolvasIzq] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMover, setShowMover] = useState(false);
  const [racionMotor,setRacionMotor]=useState('');
  
  
  useEffect(() => {
    if (!global.btoa) {
      global.btoa = encode;
    }
    //busca las tolvas del tambo
    obtenerTolvas();
    obtenerRacionMotor();
  }, []);

  
  async function obtenerTolvas() {
    setLoading(true);
    const url = 'http://' + host + '/tolvas';
    const login = 'farmerin';
    const password = 'Farmerin*2021';

    try {

      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const tolvas = await api.json();
      //tolvas lado izquierdo
      const tizq = tolvas.filter(tolva => {
        return (

          tolva.Sector == 1

        )
      });
      guardarTolvasIzq(tizq);

      //tolvas lado derecho
      const tder = tolvas.filter(tolva => {
        return (

          tolva.Sector == 2

        )
      });
      guardarTolvasDer(tder);

    } catch (error) {
      setError('Error al conectarse al tambo ' + error);
      setLoading(false);
    }
    setLoading(false);
  }

  async function obtenerRacionMotor() {

    const url = 'http://' + host + '/racionMotor';
    const login = 'farmerin';
    const password = 'Farmerin*2021';
    try {

      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const r = await api.json();
      const rac = r[0].racion;
      if (isNaN(parseFloat(rac))) {
        setRacionMotor(2);
      } else {
        setRacionMotor(parseFloat(rac));
      }
    } catch (error) {
      setRacionMotor(2);
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO SE PUEDE OBTENER RACIÓN DE CALIBRACION '+error,
        color: '#DD6B55'
      });
    }
  };

  async function pruebaMotores() {
    setShowMover(false);
    const url = 'http://' + host + '/pruebaMotores';
    const login = 'farmerin';
    const password = 'Farmerin*2021';
    try {

      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const t = await api.json();
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: t[0].mensaje,
        color: '#97D7B0'
      })


    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO HAY CONEXIÓN CON EL TAMBO',
        color: '#DD6B55'
      })
    }
  };

  return (
    <View style={styles.container}>

      {loading ?
        <ActivityIndicator size="large" color='#1b829b' />
        :

        (tolvasDer.length == 0 && tolvasIzq.length == 0) ?
          <Text style={styles.alerta}>NO HAY CONEXION CON EL TAMBO {error}</Text>
          :
          <>
            <TouchableOpacity style={styles.boton} onPress={() => {navigation.push('LadoTolva', { lado: 'IZQUIERDO', tolvas: tolvasIzq, host: host,racionMotor:racionMotor }) }}>
              <Icon
                name="chevron-left"
                size={50}
                color="#e1e8ee"
              />
              <Text></Text>
              <Text style={styles.textBoton}>LADO</Text>
              <Text style={styles.textBoton}>IZQUIERDO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton} onPress={() => { navigation.push('LadoTolva', { lado: 'DERECHO', tolvas: tolvasDer, host: host,racionMotor:racionMotor }) }}>
              <Icon
                name="chevron-right"
                size={50}
                color="#e1e8ee"

              />
              <Text></Text>
              <Text style={styles.textBoton}>LADO</Text>
              <Text style={styles.textBoton}>DERECHO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton} onPress={() => setShowMover(true)}>
              <Icon
                name="refresh"
                size={50}
                color="#e1e8ee"

              />
              <Text></Text>
              <Text style={styles.textBoton}>PRUEBA</Text>
              <Text style={styles.textBoton}>MOTORES</Text>
            </TouchableOpacity>


          </>
      }
      <Modal
        animationType='fade'
        transparent={true}
        visible={showMover}
      >
        <View style={styles.center}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.text2}>DESEA MOVER TODOS LOS MOTORES?</Text>
            </View>
            <Text></Text>
            <Button
              title=" MOVER MOTORES"
              type="outline"
              titleStyle={{ color: '#002E39' }}
              icon={
                <Icon
                  name="refresh"
                  size={35}
                  color="#0A829F"
                  marginRight= {10}
                />
              }
              onPress={pruebaMotores}
            />
            <Text></Text>
            <Button
              onPress={() => setShowMover(false)}
              type="outline"
              title=" CANCELAR"
              titleStyle={{ color: '#002E39' }}
              icon={
                <Icon
                  name="window-close"
                  size={30}
                  color="#0A829F"
                  marginRight= {10}
                  
                />
              }
            />
          </View>
        </View>

      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e8ee',
    alignContent: 'center',
    alignItems: 'center',
    
  },
  alerta: {
    backgroundColor: '#FFBF5A',
    fontSize: 15,
    color: '#868584',
    paddingHorizontal: 10,
    paddingVertical: 15,

  },
  boton: {
    alignContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    paddingTop: 10,
    marginTop: 25,
    width: 150,
    height: 150,
    backgroundColor: '#1988a5',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,


  },
  textBoton: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  tambo: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#c7db35',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  textTambo: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,

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

    backgroundColor: '#1988a5',
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
});