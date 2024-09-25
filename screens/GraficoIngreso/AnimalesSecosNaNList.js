// AnimalesSecosNaNList.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AnimalesSecosNaNList = ({ animales }) => {
  return (
    <View>
      <Text style={styles.title}>Animales Secos/NaN</Text>
      <FlatList
        data={animales}
        keyExtractor={(item) => item.rfid}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>RFID: {item.rfid}</Text>
            <Text>Estado de Reproducción: {item.estRep}</Text>
            <Text>Estado de Producción: {item.estPro}</Text>
          </View>
        )}
      />
    </View>
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
