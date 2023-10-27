import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'; 
import { db } from '../utils/constants/Firebase';

// ----------------------Project API---------------------------------------

export const createProject = async (projectData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'projects', ), projectData);
    console.log('Project added with ID: ', docRef.id);
    const projectId = docRef.id;
   
    // creating subcollect called "tasks"
    const tasksCollectionRef = collection(db, "projects",docRef.id,"tasks");
    
    // adding tasks to subcollection
    for (const task of projectData.tasks) {
      task['projectId'] = projectId;
      await addDoc(tasksCollectionRef, task);
    }


    // return docRef.id; 
  } catch (error) {
    console.error('Error adding project: ', error);
    throw error; 
  }
};

export const fetchTasksForProject = async (projectId) => {
  const tasksCollectionRef = collection(db, "projects", projectId, "tasks");
  const taskSnapshot = await getDocs(tasksCollectionRef);
  const tasks = [];
  taskSnapshot.forEach((doc) => {
    tasks.push(doc.data());
  });
  return tasks;
};




export const fetchProjects = async (userId) => {
  const projectList = [];
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'projects'), where('userId', '==', userId))
    );
    querySnapshot.forEach((doc) => {
      projectList.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error('Error fetching projects: ', error);
  }
  return projectList;
};

export const updateProject = async (projectId, newData) => {
  const projectRef = doc(db, 'projects', projectId);
  try {
    await updateDoc(projectRef, newData);
    console.log('Project updated successfully', projectId);
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



// --------------------Taskpage ApI-------------------------

