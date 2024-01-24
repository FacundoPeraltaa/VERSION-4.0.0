import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import { useFormik } from 'formik';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function ListItemTolvas({ data, animalesControl, updateControl, nuevoControl }) {

  const { id, rp, orden } = data;
  const [visible, setVisible] = useState(false);
  const [varLtsm, setVarLtsm] = useState('');
  const [varLtst, setVarLtst] = useState('');
  const [varAnorm, setVarAnorm] = useState('');
  const [existe, setExiste] = useState(false);
  const [iden,setIden]=useState('');

  useEffect(() => {
    validarAnimales()

  }, []);

  useEffect(() => {
    validarAnimales()

  }, [animalesControl]);


  function validarAnimales(){

    let cond = id.toString();
    const animal = animalesControl.filter(animal => {
      return (
        animal.erp.toString().toLowerCase().includes(cond)
      )
    });

    if (animal.length > 0) {
      setIden(animal[0].id);
      setExiste(true);
      setVarAnorm(animal[0].anorm);
      setVarLtsm(animal[0].ltsm);
      setVarLtst(animal[0].ltst);
    }

  }


  const validate = values => {
    const errors = {}

    if (!values.ltsm && !values.ltst) {
      errors.lts = "DEBE INGRESAR LOS LITROS"
    }
    if (!values.ltsm && isNaN(values.ltsm)) {
      errors.lts = "DEBE INGRESAR UN NUMERO"
    }
    return errors
  }

  const formControl = useFormik({
    initialValues: {
      ltsm: varLtsm,
      ltst: varLtst,
      anorm: varAnorm,
    },
    validate,
    onSubmit: datos => guardarControl(datos)
  })

  function guardarControl(datos) {

    setVarLtsm(datos.ltsm);
    setVarLtst(datos.ltst);
    setVarAnorm(datos.anorm);
    let ac;

    let ltsm='';
    let ltst='';
    if (datos.ltsm) ltsm=parseFloat(datos.ltsm);
    if (datos.ltst) ltst=parseFloat(datos.ltst);
    if (existe) {

      ac =
      {
       
        ltsm: ltsm,
        ltst: ltst,
        anorm: datos.anorm
      }
      updateControl(iden,ac);
    } else {
      ac =
      {
        rp: rp,
        erp: id,
        ltsm: ltsm,
        ltst: ltst,
        anorm: datos.anorm
      }
      nuevoControl(ac);
     
    }
    setExiste(true);
    setVisible(false);
  }

  function cerrar() {

    setVisible(false);
    formControl.setFieldValue('ltsm', varLtsm.toString());
    formControl.setFieldValue('ltst', varLtst.toString());
    formControl.setFieldValue('anorm', varAnorm);

  }

  function abrirRegistrarControl() {

    formControl.setFieldValue('ltsm', varLtsm.toString());
    formControl.setFieldValue('ltst', varLtst.toString());
    formControl.setFieldValue('anorm', varAnorm);
    setVisible(true)
  }

  return (

    <View style={styles.container}>
      <Text style={styles.text}>RP: {rp}  - Orden: {orden}</Text>
      <Text style={styles.text}>eRP: {id} </Text>
      <Text style={styles.text}>Lts.Mañana: {varLtsm}  - Lts.Tarde.: {varLtst}</Text>
      <Text style={styles.text}>Anorm.: {varAnorm}</Text>

      <Button
        title=" REGISTRAR CONTROL"
        style={styles.boton}
        type="outline"
        icon={
          <Icon
            name="edit"
            size={30}
            color="#3390FF"
          />
        }
        onPress={abrirRegistrarControl}
      />
      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
      >
        <View style={styles.center}>
          <View style={styles.content}>

            <View style={styles.header}>
              <Text style={styles.text2}>RP:{rp}</Text>
              <Text style={styles.text2}>eRP:{id}</Text>
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

    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
  },
  text: {
    fontSize: 15,
    color: '#2980B9',
    fontWeight: 'bold'
  },
  texto: {
    fontSize: 16,
    paddingLeft: 5,
    color: 'black'
  },
  text2: {
    color: '#e1e8ee',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10

  },
  boton: {
    margin: 5,
    color: "#f194ff",
  },
  revisada: {
    backgroundColor: '#62CD89',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    margin: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center'

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
  boton: {
    margin: 5,
    padding: 5
  },
  center: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  content: {
    backgroundColor: '#e1e8ee',
    borderWidth: 1,
    borderColor: 'white',
    margin: 20,
    marginTop: hp('15%'),
    borderRadius: 15,
    height: hp('60%'),

  },
  columnas: {
    flex: 1,
    flexDirection: 'row'
  },
  colder: {
    flex: 1,
  },
  colizq: {
    marginTop: 2,
    flex: 3,
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
  header: {

    backgroundColor: '#2980B9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15

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