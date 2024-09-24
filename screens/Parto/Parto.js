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

    //busca los animales preñados
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
          animal && animal.estrep === "preñada"
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
          ...a
        }
  
      })
      function compare( a, b ) {
        if ( a.diasPre <  b.diasPre ){
          return 1;
        }
        if (  a.diasPre >  b.diasPre ){
          return -1;
        }
        return 0;
      }
      
      an.sort( compare );
      guardarAnimales(an);
      setLoading(false);
    };

    return (
      <View style={styles.container}>
       <View style={styles.colbarra}>
          <SearchBar
            placeholder="Buscar por RP"
            onChangeText={updateSearch}
            value={rp}
            lightTheme
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.searchInput}
          />
        </View>
        <View style={styles.listado}>
        {loading || animalesFilter.length === 0 ?(
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color='#1b829b' />
            <Text style={styles.loaderText}>Cargando animales...</Text>
          </View>
        ) :  (animalesFilter.length === 0 && !animales.length) ? (
          <Text style={styles.alerta}>NO SE ENCONTRARON ANIMALES</Text>
        ) : (
          <FlatList
            data={animalesFilter}
            keyExtractor={item => item.id}
            initialNumToRender={100}
            renderItem={({ item }) => (
              <ListItem
                data={item}
                registrarParto={() => {
                  navigation.push('RegistrarParto', { animal: item, tambo, usuario });
                }}
                registrarAborto={() => {
                  navigation.push('RegistrarAborto', { animal: item, tambo, usuario });
                }}
              />
            )}
            ItemSeparatorComponent={Separator}
          />
        )}
        <AwesomeAlert
          show={alerta.show}
          showProgress={false}
          title={alerta.titulo}
          message={alerta.mensaje}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="ACEPTAR"
          confirmButtonColor={alerta.color}
          onConfirmPressed={() => setAlerta({ show: false })}
        />
      </View>
      </View>
    );
  }
  
  const Separator = () => <View style={styles.separator} />;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f7f7',
      paddingHorizontal: 3,
      paddingVertical: 3,
    },
    searchContainer: {
      backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 5,
    borderWidth: 0,
    },
    searchInput: {
      backgroundColor: '#f1f3f6',
    borderRadius: 10,
    paddingHorizontal: 10,
    },
    listado: {
      flex: 1,
      paddingTop: 10,
      borderRadius: 20,
    },
    alerta: {
      textAlign: 'center',
      backgroundColor: '#fce4ec',
      fontSize: 16,
      color: '#e91e63',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 15,
      marginVertical: 10,
    },
    separator: {
      height: 10,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loaderText: {
      marginTop: 10,
      fontSize: 16,
      color: '#1b829b',
    },
  });