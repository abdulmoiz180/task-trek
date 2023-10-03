import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/constants/Firebase'; 

export const createProject = async (projectData) => {
    try {
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      console.log('Project added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding project: ', error);
    }
  };
  
  export const fetchProjects = async () => {
    const projectList = [];
    const querySnapshot = await getDocs(collection(db, 'projects'));
    querySnapshot.forEach((doc) => {
      projectList.push({ id: doc.id, ...doc.data() });
    });
    return projectList;
  };
  
  export const updateProject = async (projectId, newData) => {
    const projectRef = doc(db, 'projects', projectId);
    try {
      await updateDoc(projectRef, newData);
      console.log('Project updated successfully');
    } catch (error) {
      console.error('Error updating project: ', error);
    }
  };
  
  export const deleteProject = async (projectId) => {
    const projectRef = doc(db, 'projects', projectId);
    try {
      await deleteDoc(projectRef);
      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project: ', error);
    }
  };