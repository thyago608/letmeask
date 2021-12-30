import * as firebase from "firebase/app";

import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

//Minhas configurações do firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_AW68sPf8HKdQt9u21ztdMWH4iqYQKXU",
  authDomain: "letmeask-ea27e.firebaseapp.com",
  databaseURL: "https://letmeask-ea27e-default-rtdb.firebaseio.com",
  projectId: "letmeask-ea27e",
  storageBucket: "letmeask-ea27e.appspot.com",
  messagingSenderId: "634469661989",
  appId: "1:634469661989:web:b8cc354b032abe8f786ecc",
};
//Inicializando o app com as minhas configs
const app = firebase.initializeApp(firebaseConfig);

//Será usado o database e a autenticação do app que estiver sido inicializado.
const database = getDatabase(app);
const auth = getAuth(app);

export { firebase, database, auth };
