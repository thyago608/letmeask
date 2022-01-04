import * as firebase from "firebase/app";

import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

//Minhas configurações do firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

//Inicializando o app com as minhas configs
const app = firebase.initializeApp(firebaseConfig);

//Será usado o database e a autenticação do app que estiver sido inicializado.
const database = getDatabase(app);
const auth = getAuth(app);

export { firebase, database, auth };
