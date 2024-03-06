import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../database/firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ListItem from './ListItem';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function App({ setShowTambos, showTambos, selectTambo }) {
  const [tambos, guardarTambos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({
     show: false,
     titulo: '',
     mensaje: '',
     color: '#DD6B55'
  });
 
  useEffect(() => {
     console.log('Iniciando la obtención de tambos');
     obtenerTambos();
  }, []);
 
  async function obtenerTambos() {
     setLoading(true);
     console.log('Estado de carga:', loading);
     try {
       AsyncStorage.getItem('usuario').then((keyValue) => {
         try {
           firebase.db.collection('tambo').where('usuarios', 'array-contains', keyValue).orderBy('nombre', 'desc').onSnapshot(snapshotTambo);
         } catch (error) {
           setAlerta({
             show: true,
             titulo: '¡ ERROR !',
             mensaje: 'NO SE PUEDEN RECUPERAR LOS TAMBOS ASOCIADOS AL USUARIO',
             color: '#DD6B55'
           });
           setLoading(false);
           setShowTambos(false);
         }
       });
     } catch (error) {
       setAlerta({
         show: true,
         titulo: '¡ ERROR !',
         mensaje: 'NO SE PUEDEN RECUPERAR LOS TAMBOS ASOCIADOS AL USUARIO',
         color: '#DD6B55'
       });
       setLoading(false);
       setShowTambos(false);
     }
  }
 
  function snapshotTambo(snapshot) {
     const tambos = snapshot.docs.map(doc => {
       return {
         id: doc.id,
         ...doc.data()
       }
     })
     guardarTambos(tambos);
     console.log('Estado de carga después de obtener los tambos:', loading);
 
     if (tambos.length > 0) {
       if (tambos.length == 1) {
         selectTambo(tambos[0]);
         setShowTambos(false);
       }
     } else {
       setAlerta({
         show: true,
         titulo: '¡ ERROR !',
         mensaje: 'NO HAY TAMBOS ASOCIADOS AL USUARIO',
         color: '#DD6B55'
       });
       setShowTambos(false);
     }
     setLoading(false);
  }
 
  if (loading) {
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="large" color="#0000ff" />
       </View>
     );
  }
 
  return (
    <>
      <Modal
        animationType='fade'
        transparent={true}
        visible={showTambos}

      >

        <View style={styles.center}>

          <View style={styles.content}>

            {loading ?
              <>
                <View style={styles.header}>
                  <Text style={styles.text2}>BUSCANDO TAMBOS...</Text>
                </View>
              </>
              :
              <>
                <View style={styles.header}>
                  <Text style={styles.text2}>SELECCIONE TAMBO</Text>
                </View>

                <FlatList
                  data={tambos}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <ListItem
                      data={item}
                      seleccionar={() => {
                        selectTambo(item)
                        setShowTambos(false)
                      }}
                    />
                  )
                  }

                />
              </>
            }
          </View>
        </View>

      </Modal>
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
        }}
      />
    </>

  );
}




const styles = StyleSheet.create({

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
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // Ajuste específico para iOS

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
    marginTop: hp('20%'),
    borderRadius: 15,
    height: hp('45%'),
    paddingBottom:10

  },

});