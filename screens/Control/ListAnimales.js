import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { isNaN, useFormik } from 'formik';

export default function ListAnimales({ data,obtenerRegistros,updateControl,control,setshowBotones,quitarAnimalControl }) {

  const { id, rp, erp, ltsm, ltst, anorm } = data;
  const [show, setShow] = useState(false);
  let ltsmorig = ltsm;
  let ltstorig = ltst;
  let anormorig = anorm;

  const validate = values => {
    const errors = {}

    if (!values.ltsm || !values.ltst) {
      errors.lts = "DEBE INGRESAR LOS LITROS"
    }
    if (isNaN(parseFloat(values.ltsm))||parseFloat(values.ltsm)<0) {
      errors.lts = "REVISE LOS DATOS INGRESADOS"
    }
    if (isNaN(parseFloat(values.ltst))||parseFloat(values.ltst)<0) {
      errors.lts = "REVISE LOS DATOS INGRESADOS"
    } 
    
   
    return errors
  }

  const formControl = useFormik({
    initialValues: {
      ltsm: ltsm.toString(),
      ltst: ltst.toString(),
      anorm: anorm,
    },
    validate,
    onSubmit: datos => guardarControl(datos)
  })

  function guardarControl(datos) {
    
    const ac=
         {
  
          ltsm:parseFloat(datos.ltsm),
          ltst:parseFloat(datos.ltst),
          anorm:datos.anorm
        }
    updateControl(id,ac);
    obtenerRegistros();
    setShow(false);
    setshowBotones(true);
  }
  
  function eliminarAnimalControl() {
   
    quitarAnimalControl(id);
    obtenerRegistros();
    setShow(false);
    setshowBotones(true);
    formControl.setFieldValue('ltsm', ltsmorig.toString());
    formControl.setFieldValue('ltst', ltstorig.toString());
    formControl.setFieldValue('anorm', anormorig);
  }

  function cerrar() {
    setShow(false);
    setshowBotones(true);
    formControl.setFieldValue('ltsm', ltsmorig.toString());
    formControl.setFieldValue('ltst', ltstorig.toString());
    formControl.setFieldValue('anorm', anormorig);

  }

  function abrir(){
    if (!control.estado) {
      setShow(true);
      setshowBotones(false);
    }
  }

  return (
    <>
      <TouchableOpacity onPress={abrir}>
        <View style={styles.container}>
          <Text style={styles.text}>RP: {rp} - Lts.M: {ltsm} / Lts.T: {ltst}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType='fade'
        transparent={true}
        visible={show}
      >
        <View style={styles.center}>
          <View style={styles.content}>

            <View style={styles.header}>
              <Text style={styles.text2}>RP:{rp}</Text>
              <Text style={styles.text2}>eRP:{erp}</Text>
            </View>

            <View style={styles.columnas}>
              <View style={styles.colizq}>
                <Text style={styles.texto}>LTS. MAÑANA:</Text>
                <TextInput
                  style={styles.entrada}
                  value={formControl.values.ltsm}
                  onChangeText={formControl.handleChange('ltsm')}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.colder}>
                <Text style={styles.texto}>LTS. TARDE:</Text>
                <TextInput
                  style={styles.entrada}
                  value={formControl.values.ltst}
                  onChangeText={formControl.handleChange('ltst')}
                  keyboardType="numeric"
                />
              </View>
            </View>
            {formControl.errors.lts ? <Text style={styles.error}>{formControl.errors.lts}</Text> : null}
            <Text style={styles.texto}>ANORMALIDAD:</Text>
            <TextInput
              style={styles.entrada}
              value={formControl.values.anorm}
              onChangeText={formControl.handleChange('anorm')}
            />

            <Text></Text>
            <Button
              onPress={formControl.handleSubmit}

              title=" GUARDAR"
              icon={
                <Icon
                  name="check-square"
                  size={30}
                  color="white"
                />
              }
            />
            <Text></Text>
            <Button
              onPress={eliminarAnimalControl}
              type="outline"
              title=" QUITAR ANIMAL"
              icon={
                <Icon
                  name="trash"
                  size={30}
                  color="#2980B9"
                />
              }
            />
            <Text></Text>
            <Button
              onPress={cerrar}
              type="outline"
              title=" CERRAR"
              icon={
                <Icon
                  name="window-close"
                  size={30}
                  color="#2980B9"
                />
              }
            />

          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e8ee',
    paddingHorizontal: 10,
    paddingVertical:15,
  },
  text: {
    fontSize: 16,
    color: '#2980B9'
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
  header: {
    backgroundColor: '#2980B9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15

  },
  content: {
    backgroundColor: '#e1e8ee',
    borderWidth: 1,
    borderColor: 'white',
    margin: 20,
    marginTop: hp('10%'),
    borderRadius: 15,
    height: hp('70%'),

  },
  center: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',

  },
  text2: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5

  },
  entrada: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    paddingLeft: 5

  },
  columnas: {

    flexDirection: 'row'
  },
  colder: {
    flex: 1,
    marginTop: 2,
  },
  colizq: {
    marginTop: 2,
    flex: 1,
  },
  texto: {
    fontSize: 16,
    paddingLeft: 5,
    color: 'black'
  },
  error: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 13,
    borderRadius: 5,
    color: 'red',
    backgroundColor: 'pink',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'red'

  },

});