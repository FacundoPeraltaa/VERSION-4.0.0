// AnimalesSecosNaNList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AnimalesSecosNaNList = ({ animales }) => {
  if (!animales || animales.length === 0) {
    return <Text style={styles.noDataText}>No se encontraron animales secos o no registrados</Text>;
  }

  return (
    <FlatList
      data={animales}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>RFID: {item.rp}</Text>
          <Text>Boton Electronico (eRP): {item.cells[1]}</Text>
          <Text style={styles.estpro}>Otro campo: {item.cells[2]}</Text> {/* Ajusta esto según los campos disponibles */}
        </View>
      )}
    />
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default AnimalesSecosNaNList;
