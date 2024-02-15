import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import {
  getAuth
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
 
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };

export const getUserIdByEmail = async (email) => {
  try {
    const userRef = doc(db, 'users', email);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.uniqueId;
    }
    return null; 
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};
