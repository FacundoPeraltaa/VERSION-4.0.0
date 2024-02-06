import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import AwesomeAlert from 'react-native-awesome-alerts';
import VerInfo from "./VerInfo";
import { useRoute } from '@react-navigation/core';


export default ({ navigation }) => {

  const route = useRoute();
  const {tambo} = route.params;
  
  const [loading, setLoading] = useState(false);
  const [producciones, setProducciones] = useState('');
  const [showTambos, setShowTambos] = useState(false);
  const [seleccionado, setSeleccionado] = useState({});
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  useEffect(() => {

    //busca los animales que no sean rechazados
    obtenerProduccion();
  }, []);




  function obtenerProduccion() {
    setLoading(true);
    try {
      firebase.db.collection('tambo').doc(tambo.id).collection('produccion').orderBy('fecha', 'desc').limit(30).get().then(snapshotProduccion)
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO SE PUEDE OBTENER LA PRODUCCIÓN',
        color: '#DD6B55'
      });
    }
  }


  function snapshotProduccion(snapshot) {
    const p = snapshot.docs.map(doc => {

      return {
        id: doc.id,
        ...doc.data()
      }

    })
    setProducciones(p);
    setLoading(false);
  };

  function eliminarProduccion(produccion) {
    try {
      const idProd = produccion.id;
      firebase.db.collection('tambo').doc(tambo.id).collection('produccion').doc(idProd).delete();
      const pr = producciones.filter(p => {
        return (
          p.id != idProd
        )
      });
      setProducciones(pr);
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: 'PRODUCCIÓN ELIMINADA',
        color: '#3AD577'
      });
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'AL ELIMINAR LA PRODUCCIÓN',
        color: '#DD6B55'
      });
    }

  }


  return (
    <View style={styles.container}>
      {loading ?
        <ActivityIndicator size="large" color='#1b829b' />
        :
        <>
          {producciones.length == 0 && <Text style={styles.alerta}>NO SE ENCONTRARON REGISTROS</Text>}


          <FlatList
            data={producciones}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListItem
                data={item}
                eliminarProduccion={() => eliminarProduccion(item)}
                info={() => {
                  setShowTambos(true)
                  setSeleccionado(item)
                  console.log(item)
                }}
              />
            )
            }
            ItemSeparatorComponent={() => <Separator />}
          />

          <Button
            title="  AGREGAR"
            icon={
              <Icon
                name="plus-square"
                size={35}
                color="white"
              />
            }
            onPress={() => {
              navigation.push('RegistrarProduccion', {
                tambo: tambo
              })
            }}
          />
        </>
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
        }}
      />
            {showTambos && <VerInfo setShowTambos={setShowTambos} showTambos={showTambos} data={seleccionado} />}

    </View>
  );
}

const Separator = () => <View style={{ flex: 1, height: 1, backgroundColor: '#2980B9' }}></View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e8ee',

  },
  alerta: {
    backgroundColor: '#FFBF5A',
    fontSize: 15,
    color: '#868584',
    paddingHorizontal: 10,
    paddingVertical: 15,

  },
});