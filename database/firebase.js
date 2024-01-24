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


  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  const db = firebase.firestore();
  const autenticacion = firebase.auth();
  const almacenamiento=firebase.storage();

 

  export default{
      firebase,
      db,
      autenticacion,
      almacenamiento
      
  }
  