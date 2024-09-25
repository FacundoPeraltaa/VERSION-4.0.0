// dataService.js
import axios from 'axios';
import firebase from '../../database/firebase';
import { Parser } from 'htmlparser2';

export const obtenerAnimalesPorErp = async (erp) => {
  try {
    const snapshot = await firebase.db.collection('animal').where('erp', '==', erp).get();
    const animales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return animales;
  } catch (error) {
    console.error("Error al obtener animales:", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
};

export const obtenerDatos = async (tambo) => {
  if (!tambo) {
    throw new Error("No se ha seleccionado un tambo");
  }
  
  const docSnapshot = await firebase.db.collection('tambo').doc(tambo.id).get();
  if (!docSnapshot.exists) {
    throw new Error("El documento del tambo no existe");
  }
  
  const racionesURL = docSnapshot.data().raciones;
  const noRegsURL = docSnapshot.data().noreg;

  if (!racionesURL || !noRegsURL) {
    throw new Error("Los campos raciones o noregs no contienen URLs válidas");
  }

  const [racionesResponse, noRegsResponse] = await Promise.all([
    axios.get(racionesURL),
    axios.get(noRegsURL)
  ]);

  const parsedData = parseHTMLTable(racionesResponse.data);
  const parsedNoRegsData = parseHTMLTable(noRegsResponse.data);
  
  return { parsedData, parsedNoRegsData };
};

const parseHTMLTable = (html) => {
  const data = [];
  let isHeaderRow = true; // Para detectar si es la fila de encabezado

  const parser = new Parser({
    onopentag(name) {
      if (name === 'tr') {
        data.push({});
      }
    },
    ontext(text) {
      if (data.length) {
        const currentRow = data[data.length - 1];
        if (!currentRow.cells) {
          currentRow.cells = [];
        }
        currentRow.cells.push(text.trim());
      }
    },
    onclosetag(tagname) {
      if (tagname === 'tr') {
        const lastRow = data[data.length - 1];
        if (lastRow && lastRow.cells) {
          const filteredCells = lastRow.cells.filter(cell => cell.trim() !== "");

          if (isHeaderRow) {
            isHeaderRow = false; // Cambiar a la siguiente fila
            return; // Ignorar la fila de encabezado
          }

          console.log('DATOS LIMPIOS', filteredCells);

          if (filteredCells.length >= 5) {
            let [RFID, RP, RacionDiaria, UltimaPasada, DiasAusente] = filteredCells;

            // Ajuste si UltimaPasada contiene -1
            if (UltimaPasada === "-1") {
              DiasAusente = "-1";
              UltimaPasada = ""; // O asigna un valor por defecto
            }

            data[data.length - 1] = { RP, DiasAusente }; // Ignorar RFID
          }
        }
      }
    }
  });
  
  parser.write(html);
  parser.end();
  return data;
};
