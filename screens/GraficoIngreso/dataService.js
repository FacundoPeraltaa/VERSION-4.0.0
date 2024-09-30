import axios from 'axios';
import firebase from '../../database/firebase';
import { Parser } from 'htmlparser2';

// Almacena los datos de los animales encontrados
let animalDetails = [];

// Función principal para obtener datos del tambo
export const obtenerDatos = async (tambo) => {
  if (!tambo) {
    throw new Error("No se ha seleccionado un tambo");
  }

  const docSnapshot = await firebase.db.collection('tambo').doc(tambo.id).get();
  if (!docSnapshot.exists) {
    throw new Error("El documento del tambo no existe");
  }

  const { raciones: racionesURL, noreg: noRegsURL } = docSnapshot.data();

  if (!racionesURL || !noRegsURL) {
    throw new Error("Los campos raciones o noregs no contienen URLs válidas");
  }

  // Hacer la solicitud a ambas URLs en paralelo
  const [racionesResponse, noRegsResponse] = await Promise.all([
    axios.get(racionesURL),
    axios.get(noRegsURL)
  ]);

  // Parsear los datos de raciones y no regs
  const parsedData = parseHTMLTable(racionesResponse.data);
  const parsedNoRegsData = await parseNoRegsData(noRegsResponse.data);

  // Devolver ambos resultados y los detalles de los animales
  return { parsedData, parsedNoRegsData, animalDetails }; // Asegúrate de retornar animalDetails
};

// Función para parsear datos de raciones
const parseHTMLTable = (html) => {
  const data = [];
  let isHeaderRow = true;

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

          // Ignorar la fila de encabezado
          if (isHeaderRow) {
            isHeaderRow = false;
            return;
          }

          if (filteredCells.length >= 5) {
            let [RFID, RP, RacionDiaria, UltimaPasada, DiasAusente] = filteredCells;

            // Manejar caso especial de UltimaPasada
            if (UltimaPasada === "-1") {
              DiasAusente = "-1";
              UltimaPasada = ""; // O asigna un valor por defecto
            }

            data[data.length - 1] = { RP, DiasAusente, RFID };
          }
        }
      }
    }
  });

  parser.write(html);
  parser.end();

  return data;
};

// Función para parsear datos de no regs
const parseNoRegsData = async (html) => {
  const data = [];
  let isHeaderRow = true;

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
    onclosetag: async (tagname) => {
      if (tagname === 'tr') {
        const lastRow = data[data.length - 1];
        if (lastRow && lastRow.cells) {
          const filteredCells = lastRow.cells.filter(cell => cell.trim() !== "");

          if (filteredCells.length === 1) {
            const [RFID] = filteredCells;

            // Buscar el RFID en Firebase
            const animalSnapshot = await firebase.db.collection('animal').where('erp', '==', RFID).get();

            if (!animalSnapshot.empty) {
              animalSnapshot.forEach(doc => {
                const animalData = doc.data();

                // Almacena los detalles del animal
                animalDetails.push(animalData); // Agrega el animalData a animalDetails

                // Verificar el estado del campo mbaja
                if (!animalData.mbaja) {
                  const { rp, erp, estpro, estrep } = animalData;
                  data[data.length - 1] = { RP: rp, ERP: erp, estPro: estpro, estRep: estrep };
                } else {
                  data[data.length - 1] = { ERP: animalData.erp, mensaje: 'Otros datos no están registrados' };
                }
              });
            } else {
              data[data.length - 1] = { mensaje: 'El animal no está registrado', RFID };
            }
          }
        }
      }
    }
  });

  parser.write(html);
  parser.end();

  return data; 
};

// Exportar los detalles de los animales
export const obtenerDetallesAnimales = () => animalDetails;
