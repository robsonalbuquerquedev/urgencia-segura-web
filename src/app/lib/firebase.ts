import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "urgenciasegura.firebaseapp.com",
  databaseURL: "https://urgenciasegura-default-rtdb.firebaseio.com/",
  projectId: "urgenciasegura",
  storageBucket: "urgenciasegura.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
