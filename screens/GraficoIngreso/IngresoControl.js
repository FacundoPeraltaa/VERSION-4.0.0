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
        // Obtener los datos del tambo
        const { parsedData, parsedNoRegsData } = await obtenerDatos(tambo);

        console.log('ARRAY ARRAY ARRAY', parsedNoRegsData)
        // Filtrar y mapear los datos relevantes para Secos/No Registrados
        const filteredSecosNaNData = parsedNoRegsData
  .filter(row => row.cells[1] !== 'RFID')
  .map(row => ({
    RP: row.cells[0], 
    RFID: row.cells[1],// RP del animal
    estPro: row.cells[2], // Estado de Producción
    estRep: row.cells[3], // Estado de Reproducción
  }));
  
        setData(parsedData); // Datos principales
        setSecosNaNData(filteredSecosNaNData); // Guardar Secos/No Registrados
  
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
    // Si la lista seleccionada es secosNaN, pasamos la data correspondiente
    if (listType === 'secosNaN') {
      setSelectedAnimals({ animals: secosNaNData, listType });
    } else {
      setSelectedAnimals({ animals, listType });
    }
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
    <Text style={styles.infoTitle}>Detalles de {selectedAnimals.listType}</Text>
    <FlatList
      data={selectedAnimals.animals.filter(item => {
        // Filtrar según el tipo de lista seleccionada
        if (selectedAnimals.listType === 'ausentes') {
          return item.DiasAusente > 0; // Filtrar animales ausentes
        }
        if (selectedAnimals.listType === 'secosNaN') {
          // Mostrar todos los animales de secosNaN, ya que se han manejado previamente
          return true; // Para mostrar todos los elementos
        }
        return true; // Incluir todos los demás tipos de animales
      })}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.infoItem}>
          <Text>Caravana (RP): {item.RP}</Text>
          <Text>Botón Electrónico (eRP): {item.RFID}</Text>
          {/* Mostrar información adicional solo para "Secos/No Registrados" */}
          {selectedAnimals.listType === 'secosNaN' && (
            <>
            
              <Text>Estado de Reproducción: {item.estrep || 'No registrada'}</Text>
              <Text>Estado de Producción: {item.estpro || 'No registrada'}</Text>
            </>
          )}
        </View>
      )}
    />
    <Button title="Cerrar" onPress={handleCloseInfoView} />
  </View>
)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f2f4f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    width: 40,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 60,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
  infoView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
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
});

export default Grafico;
