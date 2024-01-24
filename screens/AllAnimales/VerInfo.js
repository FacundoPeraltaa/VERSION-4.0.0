import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, FlatList, Modal, TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';


export default function ({ setShowTambos, showTambos, data }) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  return (
    <>
      <Modal
        animationType='fade'
        transparent={true}
        visible={showTambos}
      >
  <TouchableWithoutFeedback onPress={() => {
          setShowTambos(false)
        }}>
        <View style={styles.center}>

          <View style={styles.content}>

            {loading ?
              <>
                <View style={styles.header}>
                  <Text style={styles.text2}>CARGANDO...</Text>
                </View>
                <ActivityIndicator size="large" color='#1b829b' />
              </>
              :
              <>
                <View style={styles.header}>
                  <Text style={styles.text2}>RP: {data.rp} - ERP: {data.erp} </Text>
                </View>

                <View style={styles.info}>
                <Text style={styles.textoinfo}> ESTADO PRODUCTIVO: {data.estpro} </Text>
                  <Text style={styles.textoinfo}> ESTADO REPRODUCTIVO: {data.estrep} </Text>
                  <Text style={styles.textoinfo}> ULT. SERVICIO: {data.fservicio} </Text>
                  <Text style={styles.textoinfo}> ULT. PARTO: {data.fparto} </Text>
                  <Text style={styles.textoinfo}> INGRESO: {data.ingreso} </Text>
                  <Text style={styles.textoinfo}> SERVICIOS REALIZADOS: {data.nservicio} </Text>        
                  <View style={styles.textoinfo2}>
                  <Text style={styles.textoinfo}> RACION: {data.racion} </Text>
                  <Text style={styles.textoinfo}> RODEO: {data.rodeo} </Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                  <View style={styles.backButton}>
                  <Text style={styles.backButtonText}> VOLVER </Text>
                  </View>
                  </TouchableOpacity>
                  
                  

          
                </View>
              </>
            }
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>

  );
}



const styles = StyleSheet.create({

  text2: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,

    fontWeight: "bold"
  },

  center: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  info:{
    paddingTop: 5,
    paddingBottom: 8,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  textoinfo: {
    textTransform: "uppercase",
    fontSize: 18,
    marginBottom: 3,
    fontWeight: "bold",
    color: "#696969"
  },
  textoinfo2:{
  textTransform: "uppercase",
  fontSize: 18,
  flexDirection: "row",
  justifyContent: "space-between"
},
separator: {
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  marginVertical: 10,
},

backButton: {
  backgroundColor: '#2980B9',
  borderRadius: 5,
  alignItems: 'center',
  marginTop: 0,
  marginBottom: 0,
  alignItems: "center",
},

backButtonText: {
  textTransform: "uppercase",
    fontSize: 18,
    marginBottom: 3,
    fontWeight: "bold",
    color: "#F3FAFF"
},
  header: {

    backgroundColor: '#2980B9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 7
  },
  content: {
    backgroundColor: '#e1e8ee',
    borderWidth: 1,
    borderColor: 'white',
    margin: 20,
    marginTop: hp('30%'),
    borderRadius: 15,
    height: 270,
    paddingBottom: 10
  },

});
