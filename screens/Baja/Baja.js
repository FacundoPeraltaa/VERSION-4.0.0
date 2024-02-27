import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import { SearchBar } from 'react-native-elements';
import differenceInDays from 'date-fns/differenceInDays';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [movies] = useContext(MovieContext)
  const [animales, guardarAnimales] = useState([]);
  const [animalesFilter, guardarAnimalesFilter] = useState([]);
  const [rp, guardarRP] = useState('');

  const route = useRoute();
  const {tambo} = route.params;
  const {estado} = route.params;
  const {usuario} = route.params;

  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
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

  function obtenerAnim() {
    setLoading(true);
    //Filtro los animales con el estado requerido
    const anProd = movies.filter(animal => {
      return (
        animal && animal.fbaja == ''
      )
    });
    //calculo dias de servicio y lactancia
    const an = anProd.map(a => {
      let dl = 0;
      if (a.estpro == "En Ordeñe") {

        try {
          dl = differenceInDays(Date.now(), new Date(a.fparto));
          if (isNaN(dl)) dl = 0;
        } catch (error) {
          dl = 0;
        }

      }
      return {
        id: a.id,
        diasLact: dl,
        ...a
      }
    })
    guardarAnimales(an);
    setLoading(false);
  };



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

          <FlatList
            data={animalesFilter}
            keyExtractor={item => item.id}
            initialNumToRender={100}
            renderItem={({ item }) => (
              <ListItem
                data={item}
                registrarBaja={() => {
                  navigation.push('RegistrarBaja', {
                    animal: item, usuario: usuario,tambo:tambo 
                  })
                }}


              />
            )
            }
            ItemSeparatorComponent={() => <Separator />}
          />
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
        cancelText="No, cancelar"
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