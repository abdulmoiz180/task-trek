import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Modal, Menu, Popover, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSearch, useMenuContext } from '../../contexts/SearchContext';
import headerStyles from '../../styles/headerStyles';
import './taskPage.css';
import ContentLoader from '../contentLoader/ContentLoader';

import redDotSvg from '../../assets/images/Ellipse red.svg';
import greenDotSvg from '../../assets/images/Ellipse 12.svg';
import yellowDotSvg from '../../assets/images/Ellipse yellow.svg';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  addDoc,
} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../utils/constants/Firebase';
import dbNames from '../../utils/constants/db';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const statusColumns = {
  'To Do': { title: 'To Do', image: redDotSvg },
  'In Progress': { title: 'In Progress', image: yellowDotSvg },
  'Code InReview': { title: 'Code InReview', image: yellowDotSvg },
  'Testing': { title: 'Testing', image: yellowDotSvg },
  'Completed': { title: 'Completed', image: greenDotSvg },
  
};

const TaskPage = () => {
  const navigate = useNavigate()
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);

  const docId = useRef();

  const [newTask, setNewTask] = useState({
    title: '',
    assigned: '',
    status: 'In Progress',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchTasks = async () => {
    const tasksList = [];
    try {
      const querySnapshot = await getDocs(
        query(collection(db, dbNames.getTaskCollection(projectId)))
      );
      querySnapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }

    return tasksList;
  };
  useEffect(() => {
    setTimeout(() => {
      setData();
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchTasksData = async () => {
      const taskList = await fetchTasks(projectId);
      setTasks(taskList);
      setLoading(false);
    };

    fetchTasksData();
  }, [projectId]);

  const q = collection(db, dbNames.projectCollection);
  const [docs, error] = useCollectionData(q);

  async function handleAddTask() {
    if (newTask.title.trim() !== '') {
      const collectionName = dbNames.getTaskCollection(projectId);
      const taskRef = collection(db, collectionName);
      const newTaskData = {
        title: newTask.title,
        projectId: projectId,
        assigned: newTask.assigned,
        status: newTask.status,
      };
  
      try {
        const docRef = await addDoc(taskRef, newTaskData);
        const addedTask = { id: docRef.id, ...newTaskData };
  
        setTasks([...tasks, addedTask]);
  
        setNewTask({
          title: '',
          assigned: '',
          status: 'In Progress',
        });
      } catch (error) {
        console.error('Error adding task to Firestore:', error);
      }
    }
  }
  

  const deleteTask = async (taskId) => {
    try {
      const collectionName = dbNames.getTaskCollection(projectId);
      const taskRef = doc(db, collectionName, taskId);
      await deleteDoc(taskRef);

      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  const openEditModal = (task, index) => {
    setEditedTask(task);
    setEditedTaskIndex(index);
    setEditModalVisible(true);
  };

  // const handleUpdateTask = async () => {
  //   if (editedTaskIndex !== null) {
  //     const updatedTasks = [...tasks];
  //     updatedTasks[editedTaskIndex] = editedTask;
  //     setTasks(updatedTasks);

  //     try {
  //       const collectionName = dbNames.getTaskCollection(projectId);
  //       const taskRef = doc(db, collectionName, editedTask.id);
  //       await setDoc(taskRef, editedTask);
  //     } catch (error) {
  //       console.error('Error updating task:', error);
  //     }

  //     setEditModalVisible(false);
  //     setEditedTask({});
  //     setEditedTaskIndex(null);
  //   }
  // };

  const content = (
    <div>
      <h1>Tasks</h1>
      <Input
        ref={docId}
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => {
          setNewTask({ ...newTask, title: e.target.value });
        }}
      />
      <Input
        ref={docId}
        type="text"
        placeholder="Assigned"
        value={newTask.assigned}
        onChange={(e) => {
          setNewTask({ ...newTask, assigned: e.target.value });
        }}
      />
      <select
        value={newTask.status}
        ref={docId}
        onChange={(e) => {
          setNewTask({ ...newTask, status: e.target.value });
        }}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Code InReview">Code InReview</option>
        <option value="Testing">Testing</option>
        <option value="Completed">Completed</option>
      </select>
      <Button onClick={handleAddTask}>Add Task</Button>
    </div>
  );

  const statusImg = {
    'To Do': redDotSvg,
    'In Progress': yellowDotSvg,
    'Code InReview': yellowDotSvg,
    'Testing': yellowDotSvg,
    'Completed': greenDotSvg,
  };

  const handleStatusFilterChange = (key) => {
    setMenuFilter(key);
  };

  const { menuFilter, setMenuFilter } = useMenuContext();

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return; 
    }

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceStatus !== destinationStatus) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: destinationStatus };
        }
        return task;
      });

      setTasks(updatedTasks);

      if (result.source.index !== result.destination.index) {
        const taskToMove = updatedTasks.find((task) => task.id === taskId);
        const updatedTaskData = {
          ...taskToMove,
          status: destinationStatus,
        };

        try {
          const collectionName = dbNames.getTaskCollection(projectId);
          const taskRef = doc(db, collectionName, taskId);
          await setDoc(taskRef, updatedTaskData);
        } catch (error) {
          console.error('Error updating task in Firestore:', error);
        }
      }
    } else {
      const reorderedTasks = Array.from(tasks);
      const [removed] = reorderedTasks.splice(result.source.index, 1);
      reorderedTasks.splice(result.destination.index, 0, removed);
      
      setTasks(reorderedTasks);

      if (result.source.index !== result.destination.index) {
        try {
          const collectionName = dbNames.getTaskCollection(projectId);
          const taskRef = doc(db, collectionName, taskId);
          await setDoc(taskRef, { ...removed, status: sourceStatus });
        } catch (error) {
          console.error('Error updating task order in Firestore:', error);
        }
      }
    }
  };

  

  return (
    <div>
      {loading ? (
        <ContentLoader />
      ) : (
        <div>
          <div className="navbar">
            <div className="new-project">
              <Popover placement="bottom" content={content}>
                <Button className="newbtn">
                  <PlusOutlined />
                  New
                </Button>
              </Popover>
            </div>
          </div>

          {/* Kanban Board */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
              {Object.keys(statusColumns).map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      className={`kanban-column ${status.toLowerCase()}`}
                      ref={provided.innerRef}
                    >
                      <h2>{status}</h2>
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`card ${status.toLowerCase()} taskCard`}
                              >
                                <h4>{task.title}</h4>
                                {/* <p>Assigned: {task.assigned}</p> */}
                                <div className="status">
                                  <img src={statusImg[task.status]} alt="dot" />
                                  <p>{task.status}</p>
                                </div>
                                {/* <Button onClick={() => openEditModal(task, index)}>Edit</Button> */}
                                <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>

          {/* <Modal
            title="Edit Task"
            visible={editModalVisible}
            onOk={handleUpdateTask}
            onCancel={() => {
              setEditModalVisible(false);
              setEditedTask({});
              setEditedTaskIndex(null);
            }}
          >
            <Input
              type="text"
              placeholder="Task Title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Assigned"
              value={editedTask.assigned}
              onChange={(e) => setEditedTask({ ...editedTask, assigned: e.target.value })}
            />
            <select
              value={editedTask.status}
              onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
            >
              {Object.keys(statusColumns).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Modal> */}
          {loading && <Alert className="alert-message" message=" Loading..." type="success" />}
        </div>
      )}
    </div>
  );
};

export default TaskPage;
