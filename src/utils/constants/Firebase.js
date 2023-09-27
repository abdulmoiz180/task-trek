import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCR3Jp7UX7pATWQ0Z9ZajSi1BXiRSbBZtk",
  authDomain: "task-trek-b3130.firebaseapp.com",
  projectId: "task-trek-b3130",
  storageBucket: "task-trek-b3130.appspot.com",
  messagingSenderId: "1029260624599",
  appId: "1:1029260624599:web:e22c21087ba2bfb3c82692",
  measurementId: "G-NGCQBMQ3FY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);