import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { format } from 'date-fns'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
export default function ListItem({ data, eliminarRecepcion}) {
  const [alerta, setAlerta] = useState(false);

  const { id, fecha,tipo } = data;
  const [fechaRecep,setFecharRecep]=useState('');

  useEffect(() => {
    const f = new Date(fecha.toDate());
    const ff=format(f, 'dd/MM/yy')
    setFecharRecep(ff);
    
  }, []);
 

const confirmar = ()=>{
  setAlerta(true)
}
  return (
      <View style={styles.container}>
        <Text style={styles.text}>FECHA: {fechaRecep} - {tipo} </Text>
        <Button
                  style={styles.botonBorrar}
                  type="clear"
                  icon={
                    <Icon
                      name="trash"
                      size={35}
                      color="#2980B9"
                      onPress={confirmar}
                    />
                  }
                />
        <AwesomeAlert
        show= {alerta}
        showProgress={false}
        title="¡ ATENCIÓN !"
        message="¿ DESEA ELIMINAR ESTA RECEPCIÓN ?"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="CANCELAR"
        confirmText="ACEPTAR"
        confirmButtonColor="#3AD577"
        cancelButtonColor="#DD6B55"
        onCancelPressed={() => {
          setAlerta(false)
        }}
        onConfirmPressed={() => {
          setAlerta(false)
          eliminarRecepcion()
        }}
      />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 10,
    display: "flex",
    justifyContent: 'space-between',
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    fontSize: 16,
    color: '#070037'
  },
  leftAction: { 
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#FFF',
    padding: 15,
  },
  botonBorrar:{
    margin: 0,
    padding: 0,
  }
});