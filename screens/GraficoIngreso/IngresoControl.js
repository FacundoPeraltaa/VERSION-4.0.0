import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { obtenerDatos } from './dataService';
import { useRoute } from '@react-navigation/core';

import AnimalesSeLeyoList from '../GraficoIngreso/AnimalesSeLeyoList';
import AnimalesNoLeyoList from '../GraficoIngreso/AnimalesNoLeyoList';
import AnimalesAusentesList from '../GraficoIngreso/AnimalesAusentesList';
import AnimalesNuncaPasoList from '../GraficoIngreso/AnimalesNuncaPasoList';
import AnimalesSecosNaNList from '../GraficoIngreso/AnimalesSecosNaNList';

function CustomBarChart({ data }) {
  const maxDataValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <View
            style={[
              styles.bar,
              { height: (item.value / maxDataValue) * 200 },
              { backgroundColor: item.color }
            ]}
          />
          <Text style={styles.barValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function Grafico() {
  const [data, setData] = useState([]);
  const [secosNaNData, setSecosNaNData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animalesAusentes, setAnimalesAusentes] = useState([]);
  const [animalesNuncaPaso, setAnimalesNuncaPaso] = useState([]);
  const [animalesNoLeyo, setAnimalesNoLeyo] = useState([]);
  const [animalesSeLeyo, setAnimalesSeLeyo] = useState([]);
  const [selectedLists, setSelectedLists] = useState({
    seLeyo: false,
    noLeyo: false,
    ausentes: false,
    nuncaPaso: false,
    secosNaN: false
  });
  
  const [showInfoView, setShowInfoView] = useState(false); 
  const [selectedAnimals, setSelectedAnimals] = useState([]); 

  const route = useRoute();
  const { tambo } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { parsedData, parsedNoRegsData } = await obtenerDatos(tambo);
        setData(parsedData);
        const filteredSecosNaNData = parsedNoRegsData.filter(row => row.cells[1] !== 'RFID');
        setSecosNaNData(filteredSecosNaNData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tambo]);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const seLeyo = data.filter(row => parseInt(row.DiasAusente) === 0);
      const noLeyo = data.filter(row => parseInt(row.DiasAusente) === 1);
      const ausentes = data.filter(row => parseInt(row.DiasAusente) >= 2);
      const nuncaPaso = data.filter(row => parseInt(row.DiasAusente) === -1);
      const filteredNuncaPaso = nuncaPaso.filter(row => !row.cells.includes('RFID'));
      

      console.log('SECOS NAN', secosNaNData)

      setAnimalesSeLeyo(seLeyo);
      setAnimalesNoLeyo(noLeyo);
      setAnimalesAusentes(ausentes);
      setAnimalesNuncaPaso(filteredNuncaPaso);
    }
  }, [data]);

  const toggleList = (listType) => {
    setSelectedLists(prevSelected => ({
      ...prevSelected,
      [listType]: !prevSelected[listType]
    }));
  };

  const handleShowInfo = (animals, listType) => {
    setSelectedAnimals({ animals, listType });
    setShowInfoView(true);
  };

  const handleCloseInfoView = () => {
    setShowInfoView(false); 
    setSelectedAnimals([]); 
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1b829b" />
        <Text style={styles.loadingText}>Obteniendo información...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error al cargar los datos: {error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No se pudo obtener el gráfico de ingreso</Text>
      </View>
    );
  }

  const chartData = [
    { label: 'SE LEYÓ', value: animalesSeLeyo.length, color: '#00913f' },
    { label: 'NO SE LEYÓ', value: animalesNoLeyo.length, color: '#c81d11' },
    { label: 'AUSENTES', value: animalesAusentes.length, color: '#084d6e' },
    { label: 'NUNCA SE LEYÓ', value: animalesNuncaPaso.length, color: '#f08a0c' },
    { label: 'SECOS/NR', value: secosNaNData.length, color: '#2d3323' }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{tambo?.nombre} - Control de Ingreso</Text>
      <CustomBarChart data={chartData} />
      <View style={styles.buttonsContainer}>
        {animalesSeLeyo.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#1b829b' }]} 
            onPress={() => handleShowInfo(animalesSeLeyo, 'seLeyo')}
          >
            <Text style={styles.buttonText}>Ver Se Leyó ({animalesSeLeyo.length})</Text>
          </TouchableOpacity>
        )}
        {animalesNoLeyo.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#c81d11' }]} 
            onPress={() => handleShowInfo(animalesNoLeyo, 'noLeyo')}
          >
            <Text style={styles.buttonText}>Ver No Se Leyó ({animalesNoLeyo.length})</Text>
          </TouchableOpacity>
        )}
        {animalesAusentes.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#084d6e' }]} 
            onPress={() => handleShowInfo(animalesAusentes, 'ausentes')}
          >
            <Text style={styles.buttonText}>Ver Ausentes ({animalesAusentes.length})</Text>
          </TouchableOpacity>
        )}
        {animalesNuncaPaso.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#f08a0c' }]} 
            onPress={() => handleShowInfo(animalesNuncaPaso, 'nuncaPaso')}
          >
            <Text style={styles.buttonText}>Ver Nunca Se Leyó ({animalesNuncaPaso.length})</Text>
          </TouchableOpacity>
        )}
        {secosNaNData.length > 0 && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#2d3323' }]} 
            onPress={() => handleShowInfo(secosNaNData, 'secosNaN')}
          >
            <Text style={styles.buttonText}>Ver Secos/No Registrada ({secosNaNData.length})</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        {selectedLists.seLeyo && <AnimalesSeLeyoList animales={animalesSeLeyo} />}
        {selectedLists.noLeyo && <AnimalesNoLeyoList animales={animalesNoLeyo} />}
        {selectedLists.ausentes && <AnimalesAusentesList animales={animalesAusentes} />}
        {selectedLists.nuncaPaso && <AnimalesNuncaPasoList animales={animalesNuncaPaso} />}
        {selectedLists.secosNaN && <AnimalesSecosNaNList animales={secosNaNData} />}
      </View>

      {showInfoView && (
         <View style={styles.infoView}>
         <Text style={styles.infoTitle}>Información de Animales</Text>
         <FlatList
           data={selectedAnimals.animals}
           keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
           renderItem={({ item }) => (
             <View style={styles.infoItem}>
               <Text>Caravana (RP): {item.RP}</Text>
               <Text>Boton Electronico (eRP): {item.RFID}</Text>
               {/* Mostrar "Días Ausentes" solo si se trata de animales ausentes */}
               {selectedAnimals.listType === 'ausentes' && (
                 <Text>Días Ausente: {item.DiasAusente}</Text>
               )}
             </View>
           )}
         />
         <TouchableOpacity style={styles.closeInfoButton} onPress={handleCloseInfoView}>
           <Text style={styles.closeInfoText}>Cerrar</Text>
         </TouchableOpacity>
       </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f2f4f8'
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    marginVertical: 20,
  },
  barContainer: {
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  bar: {
    width: 40,
  },
  barValue: {
    marginTop: 5,
  },
  buttonsContainer: {
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 20,
  },
  infoView: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 10,
  },
  closeInfoButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1b829b',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeInfoText: {
    color: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Grafico;
