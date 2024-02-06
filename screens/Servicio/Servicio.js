import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import 'expo-firestore-offline-persistence';
import firebase from '../../database/firebase';
import ListItem from './ListItem';
import { SearchBar } from 'react-native-elements';
import differenceInDays from 'date-fns/differenceInDays';
import { CheckBox } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import { MovieContext } from "../Contexto";
import { useRoute } from '@react-navigation/core';

export default ({ navigation }) => {
  const [movies] = useContext(MovieContext)
  const [animalesFilter, guardarAnimalesFilter] = useState([]);
  const [rp, guardarRP] = useState('');
  //const [estado, setEstado] = useState('En Ordeñe');

  const route = useRoute();
  const { tambo } = route.params;
  const { estado } = route.params;
  const { usuario } = route.params;

  const [animales, guardarAnimales] = useState([]);

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
    obtenerAnim()
  }, [])
  useEffect(() => {
    guardarAnimalesFilter(animales)
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
  function buscarCelo() {
    if (checked) {
      guardarAnimalesFilter(animales);
      setChecked(false);
    } else {
      const filtro = animales.filter(animal => {

        return (

          animal.celo && animal

        )
      });
      guardarAnimalesFilter(filtro);
      setChecked(true);
    }



  };

  /* function obtenerAnim() {
     setLoading(true);
     try {
       firebase.db.collection('animal').where('idtambo', '==', tambo.id).where('estpro', 'in', estado).where('estrep', '==', 'vacia').where('fbaja', '==', '').orderBy('rp').get().then(snapshotAnimal)
     } catch (error) {
       setAlerta({
         show: true,
         titulo: '¡ERROR!',
         mensaje: 'No se pueden obtener los animales',
         color: '#DD6B55'
       });
     }
   }
 */
  /*
    function snapshotAnimal(snapshot) {
      const an = snapshot.docs.map(doc => {
        let d = 0;
        let dl = 0;
        if (doc.data().estrep == "vacia") {
  
          try {
            d = differenceInDays(Date.now(), new Date(doc.data().fservicio));
            if (isNaN(d)) d = 0;
          } catch (error) {
            d = 0;
          }
  
        }
        if (doc.data().estpro == "En Ordeñe") {
  
          try {
            dl = differenceInDays(Date.now(), new Date(doc.data().fparto));
            if (isNaN(dl)) dl = 0;
          } catch (error) {
            d = 0;
          }
  
        }
        return {
          id: doc.id,
          diasServicio: d,
          diasLact: dl,
          ...doc.data()
        }
  
      })
      guardarAnimales(an);
      setLoading(false);
    };
    */
  // esto es por si vienen los animales en el Redux
  function obtenerAnim() {
    setLoading(true);
    //Filtro los animales con el estado requerido
    const anProd = movies.filter(animal => {
      return (
        animal && (animal.estrep == "vacia")
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
          dl = 0;
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

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <View style={styles.colbarra}>
          <SearchBar
            placeholder="Buscar por RP "
            onChangeText={updateSearch}
            value={rp}
            lightTheme
          />
        </View>

        <View style={styles.colbarra2}>
          <CheckBox
            title='CELOS'
            onPress={() => buscarCelo()}
            checked={checked}
            containerStyle={styles.check}

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
                  registrarServicio={() => {
                    try {
                      navigation.push('RegistrarServicio', {
                        animal: item, tambo: tambo, usuario: usuario
                      })

                    } catch(error) {
                        Alert.alert(JSON.stringify(error))
                    }


                  }}


                />
              )
              }
              ItemSeparatorComponent={() => <Separator />}
            />
        }
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