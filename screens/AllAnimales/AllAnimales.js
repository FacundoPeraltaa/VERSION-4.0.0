import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import { SearchBar } from 'react-native-elements';
import differenceInDays from 'date-fns/differenceInDays';
import VerInfo from "./VerInfo";
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [movies] = useContext(MovieContext)
  const [showTambos, setShowTambos] = useState(false);
  const [seleccionado, setSeleccionado] = useState({});
  const [animales, guardarAnimales] = useState([]);
  const [animalesFilter, guardarAnimalesFilter] = useState([]);
  const [rp, guardarRP] = useState('');
  //const [estado, setEstado] = useState('En Ordeñe');

  const route = useRoute();
  const {tambo} = route.params;
  const {estado} = route.params;
  const {usuario} = route.params;

  //const animalesHome = navigation.getParam('animales');
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
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
    const anProd = movies
    //calculo dias de servicio y lactancia
    const an = anProd.map(a => {

      let d = 0;
      let dl = 0;
      if (a.estrep == "vacia") {

        try {
          d = differenceInDays(Date.now(), new Date(a.fservicio));
          if (isNaN(d)) d = 0;
        } catch (error) {
          d = 0;
        }

      }
      if (a.estpro == "En Ordeñe") {

        try {
          dl = differenceInDays(Date.now(), new Date(a.fparto));
          if (isNaN(dl)) dl = 0;
        } catch (error) {
          d = 0;
        }

      }
      return {
        id: a.id,
        diasServicio: d,
        diasLact: dl,
        ...a
      }

    })
    guardarAnimales(an);
    setLoading(false);
  };
  
  /* esto es por si vienen los animales en el Redux
  function obtenerAnim() {
    setLoading(true);
    //Filtro los animales con el estado requerido
    const anProd = animales.filter(animal => {
      return (
        animal && (estado.indexOf(animal.estpro) > -1)
      )
    });
    //calculo dias de servicio y lactancia
    const an = anProd.map(a => {

      let d = 0;
      let dl = 0;
      if (a.estrep == "vacia") {

        try {
          d = differenceInDays(Date.now(), new Date(a.fservicio));
          if (isNaN(d)) d = 0;
        } catch (error) {
          d = 0;
        }

      }
      if (a.estpro == "En Ordeñe") {

        try {
          dl = differenceInDays(Date.now(), new Date(a.fparto));
          if (isNaN(dl)) dl = 0;
        } catch (error) {
          d = 0;
        }

      }
      return {
        id: a.id,
        diasServicio: d,
        diasLact: dl,
        ...a
      }

    })
    guardarAnimales(an);
    setLoading(false);
  };
 */
  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <View style={styles.colbarra}>
          <SearchBar
            placeholder="Buscar por RP"
            onChangeText={updateSearch}
            value={rp}
            lightTheme
          />
        </View>

      </View>
      <View style={styles.listado}>
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
                  info={() => {
                    setShowTambos(true)
                    setSeleccionado(item)
                  }}


                />
              )
              }
              ItemSeparatorComponent={() => <Separator />}
            />
        }
      </View>
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
  check: {
    marginTop: 10,
    backgroundColor: '#e1e8ee',

  },
  barra: {
    flex: 1,
    flexDirection: 'row',

  },
  colbarra: {
    flex: 2,

  },
  colbarra2: {

    flex: 1,


  },

  listado: {
    flex: 8,

  },
  alerta: {
    backgroundColor: '#FFBF5A',
    fontSize: 15,
    color: '#868584',
    paddingHorizontal: 10,
    paddingVertical: 15,

  },
});