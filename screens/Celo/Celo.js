import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import { SearchBar } from 'react-native-elements';
import differenceInDays from 'date-fns/differenceInDays';
import { MovieContext } from "../Contexto"
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useRoute } from '@react-navigation/core';


export default ({ navigation }) => {
  const [movies, setMovies] = useContext(MovieContext)
  const [animales, guardarAnimales] = useState([]);
  const [animalesFilter, guardarAnimalesFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rp, guardarRP] = useState('');

  const route = useRoute();
  const {usuario} = route.params;

  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55',
    vuelve:false
  });

  useEffect(() => {

    //busca los animales que no sean rechazados
    obtenerAnim();
  }, []);

  useEffect(() => {
    guardarAnimalesFilter(animales);
  }, [animales])

  function updateSearch(rp) {
    if (rp) {
      const cond = rp.toLowerCase();
      const filtro = animales.filter(animal => {
        return (
          animal.rp.toString().toLowerCase().includes(cond)
        )
      });
      guardarAnimalesFilter(filtro);
      guardarRP(rp);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      guardarAnimalesFilter(animales);
      guardarRP(rp);
    }

  };

  const hoy = new Date();

  function obtenerAnim() {
    setLoading(true);
    //Filtro los animales con el estado requerido
    const anProd = movies.filter(animal => {
      return (
        animal && animal.estpro != ""
      )
    });
    //calculo dias de servicio y lactancia
    const an = anProd.map(a => {

      let d = 0;
      if (a.estrep != "vacia") {

        try {
          d = differenceInDays(Date.now(), new Date(a.fservicio));
        } catch (error) {
          d = 0;
        }

      }

      return {
        id: a.id,
        diasPre: d,
        celar: false,
        ...a
      }

    })
    guardarAnimales(an);
    setLoading(false);
  };

  const registrarCelo = () => {
    let e = false;
    let hayCelo = false;
    animales.forEach(a => {
      if (a.celar) {
        hayCelo = true;
        try {
          const an = {
            celo: true
          }
          let objIndex = movies.findIndex((obj => obj.id == a.id));
          const copia = [...movies]
          copia[objIndex].celo = true
          setMovies(copia)
          firebase.db.collection('animal').doc(a.id).update(an);
          firebase.db.collection('animal').doc(a.id).collection('eventos').add({
            fecha: hoy,
            tipo: 'Celo',
            usuario: usuario
          });
        } catch (error) {
          e = true;
          setAlerta({
            show: true,
            titulo: 'Error!',
            mensaje: 'No se pudo registrar el celo',
            color: '#DD6B55'
          });
        }
      }
    })
    if (!e && hayCelo) {
      setAlerta({
        show: true,
        titulo: 'Atención!',
        mensaje: 'Celos registrados con éxito!',
        color: '#3AD577',
        vuelve: true
      });

    }else{
      setAlerta({
        show: true,
        titulo: 'Atención!',
        mensaje: 'No se registraron celos',
        color: '#3AD577',
        vuelve:true
      });
      
    }
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar por RP"
        onChangeText={updateSearch}
        value={rp}
        lightTheme
      />
      {loading ?
        <ActivityIndicator size="large" color='#1b829b' />
        :

        animalesFilter.length == 0 ?
          <Text style={styles.alerta}>NO SE ENCONTRARON ANIMALES</Text>
          :
          <>
          <FlatList
            data={animalesFilter}
            keyExtractor={item => item.id}
            initialNumToRender={100}
            renderItem={({ item }) => (
              <ListItem
                data={item}
                guardarAnimales={guardarAnimales}
                animales={animales}
              />
            )
            }
            ItemSeparatorComponent={() => <Separator />}
          />
      <Button
        title="  ACEPTAR"
        icon={
          <Icon
            name="check-square"
            size={35}
            color="white"
            />}
            onPress={registrarCelo}
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
          if (alerta.vuelve==true){
            navigation.popToTop();
          }
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