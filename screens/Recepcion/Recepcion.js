import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useRoute } from '@react-navigation/core';


export default ({ navigation }) => {

  const route = useRoute();
  const {tambo} = route.params;
  const {usuario} = route.params;

  const [loading, setLoading] = useState(false);
  const [recepciones, setRecepciones] = useState('');
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  useEffect(() => {

    //busca los animales que no sean rechazados
    obtenerRecepcion();
  }, []);




  function obtenerRecepcion() {
    setLoading(true);
    try {
      firebase.db.collection('tambo').doc(tambo.id).collection('recepcion').orderBy('fecha', 'desc').limit(30).get().then(snapshotRecepcion)
    } catch (error) {
      setAlerta({
        show: true,
        titulo: 'Error!',
        mensaje: 'No se pueden obtener las recepciones',
        color: '#DD6B55'
      });
    }
  }


  function snapshotRecepcion(snapshot) {
    const r = snapshot.docs.map(doc => {

      return {
        id: doc.id,
        ...doc.data()
      }

    })
    setRecepciones(r);
    setLoading(false);
  };

  function eliminarRecepcion(recepcion) {
    try {

      if (recepcion.foto.length > 0) {

        // Borra la foto
        const imageRef = firebase.almacenamiento.ref(tambo.id + '/recepciones/' + recepcion.foto);
        imageRef.delete();

      }

      const idRecep = recepcion.id;
      firebase.db.collection('tambo').doc(tambo.id).collection('recepcion').doc(idRecep).delete();
      const recep = recepciones.filter(r => {
        return (
          r.id != idRecep
        )
      });
      setRecepciones(recep);
      setAlerta({
        show: true,
        titulo: 'Atención!',
        mensaje: 'Recepción eliminada',
        color: '#3AD577'
      });

    } catch (error) {
      setAlerta({
        show: true,
        titulo: 'Error!',
        mensaje: 'No se puede eliminar la recepción',
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
          {recepciones.length == 0 && <Text style={styles.alerta}>NO SE ENCONTRARON REGISTROS</Text>}
          <FlatList
            data={recepciones}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ListItem
                data={item}
                eliminarRecepcion={() => eliminarRecepcion(item)}
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
              navigation.push('RegistrarRecepcion', {
                tambo: tambo,
                usuario:usuario
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
        cancelText="CANCELAR"
        confirmText="ACEPTAR"
        confirmButtonColor={alerta.color}
        onCancelPressed={() => {
          setAlerta({ show: false })
        }}
        onConfirmPressed={() => {
          setAlerta({ show: false })
        }}
      />
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