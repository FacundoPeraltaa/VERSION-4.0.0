import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import { SearchBar, CheckBox } from 'react-native-elements';
import differenceInDays from 'date-fns/differenceInDays';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [movies] = useContext(MovieContext);
  const [animalesFilter, guardarAnimalesFilter] = useState([]);
  const [rp, guardarRP] = useState('');

  const route = useRoute();
  const { tambo, estado, usuario } = route.params;

  const [animales, guardarAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [alerta, setAlerta] = useState({
    show: false,
    titulo: '',
    mensaje: '',
    color: '#DD6B55'
  });

  useEffect(() => {
    obtenerAnim();
  }, []);

  useEffect(() => {
    if (!loading) {
      guardarAnimalesFilter(animales);
    }
  }, [animales, loading]);

  function updateSearch(rp) {
    if (rp) {
      const cond = rp.toLowerCase();
      const filtro = animales.filter(animal => animal.rp.toString().toLowerCase().includes(cond));
      guardarAnimalesFilter(filtro);
      guardarRP(rp);
    } else {
      guardarAnimalesFilter(animales);
      guardarRP(rp);
    }
  }

  function buscarCelo() {
    if (checked) {
      guardarAnimalesFilter(animales);
      setChecked(false);
    } else {
      const filtro = animales.filter(animal => animal.celo);
      guardarAnimalesFilter(filtro);
      setChecked(true);
    }
  }

  function obtenerAnim() {
    setLoading(true);
    const anProd = movies.filter(animal => animal && animal.estrep === "vacia");
    const an = anProd.map(a => {
      let d = 0, dl = 0;
      if (a.estrep === "vacia") {
        try {
          d = differenceInDays(Date.now(), new Date(a.fservicio));
          if (isNaN(d)) d = 0;
        } catch (error) {
          d = 0;
        }
      }
      if (a.estpro === "En Ordeñe") {
        try {
          dl = differenceInDays(Date.now(), new Date(a.fparto));
          if (isNaN(dl)) dl = 0;
        } catch (error) {
          dl = 0;
        }
      }
      return {
        id: a.id,
        diasServicio: d,
        diasLact: dl,
        ...a
      };
    });
    guardarAnimales(an);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
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
        <View style={styles.colbarra2}>
          <CheckBox
            title='CELOS'
            onPress={buscarCelo}
            checked={checked}
            containerStyle={styles.check}
            textStyle={styles.checkText}
          />
        </View>
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
                registrarServicio={() => {
                  try {
                    navigation.push('RegistrarServicio', {
                      animal: item, tambo: tambo, usuario: usuario
                    });
                  } catch (error) {
                    Alert.alert(JSON.stringify(error));
                  }
                }}
              />
            )}
            ItemSeparatorComponent={Separator}
          />
        )}
      </View>
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
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 5,
  },
  colbarra: {
    flex: 2,
    marginRight: 15,
  },
  colbarra2: {
    flex: 1,
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
  check: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    elevation: 3,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  checkText: {
    fontSize: 16,
    color: '#1b829b',
    fontWeight: '600',
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
