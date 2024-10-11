import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { encode } from 'base-64';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute } from '@react-navigation/core';
import firebase from '../../database/firebase';


export default ({ navigation }) => {
  const route = useRoute();
  const { tambo } = route.params;
  const { id, host } = tambo; // Obtener el idtambo y host

  const [tolvasDer, guardarTolvasDer] = useState([]);
  const [tolvasIzq, guardarTolvasIzq] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMover, setShowMover] = useState(false);
  const [racionMotor, setRacionMotor] = useState('');
  const [cancelando, setCancelando] = useState(false);
  const [alerta, setAlerta] = useState({ show: false, titulo: '', mensaje: '', color: '' });
  const [botonColor, setBotonColor] = useState('#004d00'); // Por defecto, color de los botones
  const [mostrarBotonDetener, setMostrarBotonDetener] = useState(false); // Controla si se debe mostrar el botón "DETENER MOTORES"

  // Lista de idtambo específicos
  const specificIdTambo = [
    '7qVCmAajpuYIcpXEoUJ6',
    '7uZStkH1TDzgkhkgzUtH',
    'PgIQZisE8chKEODVk72E',
    'SrkWyL9Uoa6uBFkf3WaH',
    'cictlHfUlNkH0KnQtXJS',
    'cyXDv2ydRIbXEmFRaUND',
    'e1bZh7buudNXzbDg0WCe',
    'e4ZnILyD3WBb5tuamAiq',
    'gTzakuM6yFSNZgjJopZG',
    'nkVublhzhK1pwFEjx9DW',
  ];

  useEffect(() => {
    if (!global.btoa) {
      global.btoa = encode;
    }

    // Verificar si el idtambo está definido en specificIdTambo
    if (specificIdTambo.includes(id)) {
      // Si está en la lista específica, mantener el comportamiento original
      obtenerTolvas();
      setMostrarBotonDetener(false); // No mostrar botón de detener
    } else {
      // Si el idtambo no está en la lista specificIdTambo, verificar en Firebase
      verificarIdTamboEnBaseDeDatos(id);
    }

    obtenerRacionMotor();
  }, []);

  // Función para verificar si el idtambo está en la base de datos
  async function verificarIdTamboEnBaseDeDatos(idtambo) {
    try {
      const tamboRef = firebase.db.collection('tambo');
      const query = tamboRef.where('idtambo', '==', idtambo);
      const snapshot = await query.get();

      if (!snapshot.empty) {
        // Si el idtambo está en la base de datos pero no en specificIdTambo
        setBotonColor('#228B22'); // Cambiar el color de los botones
        setMostrarBotonDetener(true); // Mostrar botón "Detener Motores"
        obtenerTolvas(); // Obtener tolvas si el idtambo existe
      } else {
        // Si el idtambo no está en la base de datos
        setError('El tambo no existe en la base de datos');
      }
    } catch (error) {
      setError('Error al consultar la base de datos: ' + error.message);
    }
  }

  async function obtenerTolvas() {
    setLoading(true);
    const url = 'http://' + host + '/tolvas';
    const login = 'farmerin';
    const password = 'Farmerin*2021';

    try {
      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const tolvas = await api.json();
      const tizq = tolvas.filter(tolva => tolva.Sector == 1);
      guardarTolvasIzq(tizq);
      const tder = tolvas.filter(tolva => tolva.Sector == 2);
      guardarTolvasDer(tder);
    } catch (error) {
      setError('Error al conectarse al tambo ' + error);
      setLoading(false);
    }
    setLoading(false);
  }

  async function obtenerRacionMotor() {
    const url = 'http://' + host + '/racionMotor';
    const login = 'farmerin';
    const password = 'Farmerin*2021';

    try {
      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const r = await api.json();
      const rac = r[0].racion;
      if (isNaN(parseFloat(rac))) {
        setRacionMotor(2);
      } else {
        setRacionMotor(parseFloat(rac));
      }
    } catch (error) {
      setRacionMotor(2);
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO SE PUEDE OBTENER RACIÓN DE CALIBRACION ' + error,
        color: '#DD6B55'
      });
    }
  }

  async function pruebaMotores() {
    setShowMover(false);
    const url = 'http://' + host + '/pruebaMotores';
    const login = 'farmerin';
    const password = 'Farmerin*2021';

    try {
      const api = await fetch(url, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const t = await api.json();
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: t[0].mensaje,
        color: '#97D7B0'
      });
      // Si se ejecuta la prueba de motores, mostrar el botón de detener
      setMostrarBotonDetener(true);
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'NO HAY CONEXIÓN CON EL TAMBO',
        color: '#DD6B55'
      });
    }
  }

  async function cancelarAccion() {
    setCancelando(true);
    const url = 'http://' + host + '/cancelarAccion'; // Cambia esta URL según tu configuración
    const login = 'farmerin';
    const password = 'Farmerin*2021';

    try {
      const api = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${login}:${password}`),
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const result = await api.json();
      setAlerta({
        show: true,
        titulo: '¡ATENCIÓN!',
        mensaje: result.mensaje || 'Acción cancelada exitosamente.',
        color: '#97D7B0'
      });
    } catch (error) {
      setAlerta({
        show: true,
        titulo: '¡ERROR!',
        mensaje: 'Error al cancelar la acción: ' + error,
        color: '#DD6B55'
      });
    }
    setCancelando(false);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color='#1b829b' />
      ) : (
        (tolvasDer.length == 0 && tolvasIzq.length == 0) ? (
          <Text style={styles.alerta}>NO HAY CONEXIÓN CON EL TAMBO {error}</Text>
        ) : (
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.boton, { backgroundColor: botonColor }]} onPress={() => { navigation.push('LadoTolva', { lado: 'IZQUIERDO', tolvas: tolvasIzq, host: host, racionMotor: racionMotor }) }}>
                <Icon name="chevron-left" size={40} color="#ffffff" />
                <Text style={styles.textBoton}>LADO IZQUIERDO</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.boton, { backgroundColor: botonColor }]} onPress={() => { navigation.push('LadoTolva', { lado: 'DERECHO', tolvas: tolvasDer, host: host, racionMotor: racionMotor }) }}>
                <Icon name="chevron-right" size={40} color="#ffffff" />
                <Text style={styles.textBoton}>LADO DERECHO</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.boton, { backgroundColor: botonColor }]} onPress={() => setShowMover(true)}>
                <Icon name="refresh" size={40} color="#ffffff" />
                <Text style={styles.textBoton}>PRUEBA MOTORES</Text>
              </TouchableOpacity>

              {/* Mostrar el botón de "Detener Motores" solo si no es un idtambo específico pero está en la base de datos */}
              {mostrarBotonDetener && (
                <Button
                  onPress={cancelarAccion}
                  type="outline"
                  title="DETENER MOTORES"
                  titleStyle={styles.detenerTitle}
                  icon={<Icon name="stop" size={30} color="#FF4D4D" marginRight={10} />}
                  disabled={cancelando}
                  buttonStyle={[styles.detenerBoton, { backgroundColor: botonColor }]}
                />
              )}
            </View>
          </>
        )
      )}

      <Modal animationType='fade' transparent={true} visible={showMover}>
        <View style={styles.center}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.text2}>¿DESEA MOVER TODOS LOS MOTORES?</Text>
            </View>
            <Button
              title="MOVER MOTORES"
              type="outline"
              titleStyle={styles.modalTitle}
              icon={<Icon name="refresh" size={35} color="#0A829F" marginRight={10} />}
              onPress={pruebaMotores}
            />
            <Button
              onPress={() => setShowMover(false)}
              type="outline"
              title="CANCELAR"
              titleStyle={styles.modalTitle}
              icon={<Icon name="window-close" size={30} color="#0A829F" marginRight={10} />}
            />
          </View>
        </View>
      </Modal>

      {alerta.show && (
        <View style={[styles.alerta, { backgroundColor: alerta.color }]}>
          <Text style={styles.alerta}>{alerta.titulo}</Text>
          <Text style={styles.alerta}>{alerta.mensaje}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  boton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    width: 150,
    height: 150,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    elevation: 3,
    marginHorizontal: 10,
  },
  textBoton: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  alerta: {
    textAlign: 'center',
    backgroundColor: '#FFBF5A',
    fontSize: 16,
    color: '#444',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  header: {
    padding: 15,
    backgroundColor: '#002E39',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  text2: {
    fontSize: 18,
    color: '#e1e8ee',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowColor: '#000',
    elevation: 5,
  },
  detenerBoton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    paddingVertical: 15,
    width: 150,
    height: 150,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    elevation: 3,
    marginHorizontal: 10,
  },
  detenerTitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalTitle: {},
});
