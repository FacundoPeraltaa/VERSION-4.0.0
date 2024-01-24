import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function ListItem({ data,registrarParto,registrarAborto }) {
  const [alerta, setAlerta] = useState(false);
  const { id, rp,fservicio,estrep,estpro,diasPre,categoria } = data;
  const [parto, setParto] = useState(false);
  const [siglas, guardarSiglas] =useState({
    cat:'VC',
    prod: 'S',
    rep: 'V'
  })

  useEffect(() => {

    let c='VC';
    let p='S';
    let r='V';

    if (categoria!='Vaca') c='VQ';
    if (estpro!='seca') p='O';
    if (estrep!='vacia') r='P'

    guardarSiglas({
      cat:c,
      prod: p,
      rep: r
    })
      
  }, []);

  const confirmar = ()=>{
    setAlerta(true)
  }

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={confirmar}>
        <Text style={styles.text}>RP: {rp} ({siglas.cat}/{siglas.prod}/{siglas.rep}) - DIAS PREÑEZ: {diasPre} </Text>
        </TouchableOpacity>

        <AwesomeAlert
        show= {alerta}
        showProgress={false}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="ABORTO"
        confirmText="PARTO"
        onDismiss={()=>setAlerta(false)}
        cancelButtonTextStyle={{
          fontSize:50,
          fontWeight:"bold",
          textAlign:"center",         
        }}
        confirmButtonTextStyle={{
          fontSize:50,
          fontWeight:"bold",
          textAlign:"center",         
        }}
        confirmButtonColor="#3AD577"
        cancelButtonColor="#DD6B55"
        contentContainerStyle={{
          width:360,
          height:300,
          margin:0,
          padding:0
        }}
        contentStyle={{
          padding: 0,
          margin: 0,
        }}
        actionContainerStyle={{
          display:"flex",
          flexDirection:"column-reverse",
          justifyContent:"space-around",
          gap:5,
          alignItems:"center",
          margin:0,
          padding:0
        }}
        cancelButtonStyle={{
          width:335,
          height:145,
          margin:0,
          padding:0,
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}
        confirmButtonStyle={{
          width:335,
          height:145,
          margin:0,
          padding:0,
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}
        onCancelPressed={() => {
          setAlerta(false)
          registrarAborto()
        }}
        onConfirmPressed={() => {
          setAlerta(false)
          registrarParto()
        }}
      />
      </>
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
    backgroundColor: '#249E31',
    justifyContent: 'center',
    flex: 1,
  },
  RightAction: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    flex:1,
    alignItems: 'flex-end'
  },
  actionText: {
    fontSize: 16,
    color: '#FFF',
    padding: 15,
  },

});