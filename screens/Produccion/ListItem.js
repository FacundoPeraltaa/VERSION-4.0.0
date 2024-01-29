import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns'
import { Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ListItem({ data,eliminarProduccion, info}) {

  const { id, fecha,produccion } = data;
  const [fechaProd,setFechaProd]=useState('');
  const [alerta, setAlerta] = useState(false);

  useEffect(() => {
    const f = new Date(fecha.toDate());
    const ff=format(f, 'dd/MM/yy')
    setFechaProd(ff);

  }, []);
 

  const confirmar = ()=>{
    setAlerta(true)
  }
  return (
<>
     <TouchableOpacity onPress={info}>

      <View style={styles.container}>
        <Text style={styles.text}>FECHA: {fechaProd} - LTS: {produccion} </Text>
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
        message="¿ DESEA ELIMINAR ESTA PRODUCCIÓN ?"
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
          eliminarProduccion()
        }}
      />
      </View>
      </TouchableOpacity>
      </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical: 10,
    display: "flex",
    justifyContent:"space-between",
    alignItems:"center",
    flexDirection:"row"
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

});