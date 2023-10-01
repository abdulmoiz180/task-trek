import { initializeApp } from "firebase/app";
import { getAuth }  from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDAk4dY00qmAKeQ8Ndx8ySZEIiwguzIn7I",
  authDomain: "task-trek-c6b75.firebaseapp.com",
  databaseURL: "https://task-trek-c6b75-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "task-trek-c6b75",
  storageBucket: "task-trek-c6b75.appspot.com",
  messagingSenderId: "1033846365318",
  appId: "1:1033846365318:web:ade2c5ae2e80050b204507"
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app);