/import 'expo-firestore-offline-persistence';/
/*import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';*/



//VERSION 9
/*
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from 'firebase/firestore';*/
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyATYDND7IQvZV6_2EqKDCX3xHzgSVr51qo",
    authDomain: "farmerin-navarro.firebaseapp.com",
    databaseURL: "https://farmerin-navarro.firebaseio.com",
    projectId: "farmerin-navarro",
    storageBucket: "farmerin-navarro.appspot.com",
    messagingSenderId: "684596883598",
    appId: "1:684596883598:web:5ec34bd86443ba0b40d9df",
    measurementId: "G-8NQR6HE295"
  };


  /*
  const app = initializeApp(firebaseConfig);
  const db = getFirestore();
  const autenticacion = getAuth(app);
 */

  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  const db = firebase.firestore();
  firebase.firestore().enablePersistence();
  const almacenamiento=firebase.storage();
  const autenticacion = firebase.auth();

 

  export default{
      firebase,
      db,
      autenticacion,
      almacenamiento
      
  }