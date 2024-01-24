import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns'

export default function ListItem({data,listarControles}) {

  const { id, fecha,estado } = data;
  const [fechaCon,setFechaCon]=useState('');

  useEffect(() => {
    const f = new Date(fecha.toDate());
    const ff=format(f, 'dd/MM/yyyy')
    setFechaCon(ff);
    
  }, []);
 

  return (
    <TouchableOpacity onPress={listarControles}>
     
      <View style={styles.container}>
        <Text style={styles.text}>{fechaCon} - {estado?'CONFIRMADO':'PENDIENTE'}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    color:'#2980B9'
  },
  leftAction: { 
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#FFF',
    padding: 20,
  },

});