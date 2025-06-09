import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBYGzCqKpjFZ_fWbYKuZTdJf5ckllD7v_g",
  authDomain: "urgenciasegura.firebaseapp.com",
  databaseURL: "https://urgenciasegura-default-rtdb.firebaseio.com",
  projectId: "urgenciasegura",
  storageBucket: "urgenciasegura.appspot.com",
  messagingSenderId: "736638285434",
  appId: "1:736638285434:web:283c087105ee225ebaadc3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
