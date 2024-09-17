import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Modal, Menu, Popover, Alert, FloatButton, Typography, Progress } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './taskPage.css';
import ContentLoader from '../contentLoader/ContentLoader';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import MenuBar from '../../layout/MenuBar';

import Todo from "../../assets/images/check.png"
import Inprogress from "../../assets/images/growth.png"
import Review from "../../assets/images/rating.png"
import Testing from "../../assets/images/testing.png"
import Completed from "../../assets/images/list.png"
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../utils/constants/Firebase';
import dbNames from '../../utils/constants/db';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const { Title, Text } = Typography;


const statusColumns = {
  'Todo': { title: 'To-Do', img: Todo },
  'InProgress': { title: 'InProgress', img: Inprogress },
  'Review': { title: 'Review', img: Review },
  'Testing': { title: 'Testing', img: Testing },
  'Completed': { title: 'Completed', img: Completed },
};

const TaskPage = () => {
  const { userId, projectId, projectName } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const docId = useRef();
  const [newTask, setNewTask] = useState({
    title: '',
    assigned: '',
    status: 'Todo',
    timestamp: '',
  });

  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }, 2000);
  }, []);


  useEffect(() => {
    const fetchTasksData = async () => {
      let taskList = await fetchTasks(projectId);
      taskList = taskList.sort(orderBy(["order"], ["asc"]));
      console.table(taskList);
      setTasks(taskList);
      setLoading(false);
    };

    fetchTasksData();
  }, [projectId, tasks]);

  async function handleAddTask() {
    if (newTask.title.trim() !== '') {
      const collectionName = dbNames.getTaskCollection(projectId);
      const taskRef = collection(db, collectionName);
      const docsSet = await getDocs(taskRef);
      const newTaskData = {
        title: newTask.title,
        projectId: projectId,
        status: newTask.status,
        order: docsSet.size + 1,
        timestamp: serverTimestamp(),
      };

      try {
        const docRef = await addDoc(taskRef, newTaskData);
        const addedTask = { id: docRef.id, ...newTaskData };

        setTasks([...tasks, addedTask]);

        setNewTask({
          title: '',
          status: 'Todo',
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


  const content = (
    <div className='pop-content-container'>
      <Title className='pop-title'>Tasks</Title>
      <Input
        ref={docId}
        type="text"
        className='title-input'
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => {
          setNewTask({ ...newTask, title: e.target.value });
        }}
      />

      <Button className='task-add' onClick={handleAddTask}>Add Task</Button>

    </div>
  );

  const statusClr = {
    'Todo': "todo-clr",
    'InProgress': "inprogress-clr",
    'Review': "review-clr",
    'Testing': "testing-clr",
    'Completed': "completed-clr",
  };

  const statusTitleclr = {
    'Todo': "todo-ttl-clr",
    'InProgress': "inprogress-ttl-clr",
    'Review': "review-ttl-clr",
    'Testing': "testing-ttl-clr",
    'Completed': "completed-ttl-clr",
  };


  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination.droppableId;
    const taskId = result.draggableId;

    if (sourceStatus !== destinationStatus) {


      const taskToMove = tasks.find((task) => task.id === taskId);

      taskToMove.status = destinationStatus;
      const updateData = { status: destinationStatus };
      if (result.destination.index !== result.source.index) {
        updateData['order'] = result.destination.index;
        reorder({ status: destinationStatus });
      }
      saveTask(updateData, taskId);

    } else {


      if (result.destination.index !== result.source.index) {

        reorder();
        console.log({ id: taskId, order: result.destination.index })
        saveTask({ order: result.destination.index }, taskId);
      }

    }
    function reorder(fields) {
      let prev = tasks.find(t => t.order === result.destination.index),
        next = tasks.find(t => t.order === result.source.index);
      if (prev) {
        prev.order = result.source.index;
      }

      if (next) {
        next.order = result.destination.index;
        next = { ...next, fields };
      }


      const reordered = tasks.sort(orderBy(["order"], ["asc"]));
      setTasks(reordered);

    }
    async function saveTask(taskData, id) {
      try {
        const collectionName = dbNames.getTaskCollection(projectId);
        const taskRef = doc(db, collectionName, id);
        delete taskData.id;
        setDoc(taskRef, taskData, { merge: true });
      } catch (error) {
        console.error('Error updating task in Firestore:', error);
      }
    }
  };

  function sortBy(key, cb) {
    if (!cb) cb = () => 0;
    return (a, b) => (a[key] > b[key]) ? 1 :
      ((b[key] > a[key]) ? -1 : cb(a, b));
  }

  function sortByDesc(key, cb) {
    if (!cb) cb = () => 0;
    return (b, a) => (a[key] > b[key]) ? 1 :
      ((b[key] > a[key]) ? -1 : cb(b, a));
  }

  function orderBy(keys, orders) {
    let cb = () => 0;
    keys.reverse();
    orders.reverse();
    for (const [i, key] of keys.entries()) {
      const order = orders[i];
      if (order === 'asc')
        cb = sortBy(key, cb);
      else if (order === 'desc')
        cb = sortByDesc(key, cb);
      else
        throw new Error(`Unsupported order "${order}"`);
    }
    return cb;
  }
  return (

    <div>

      {loading ? (
        <ContentLoader />
      ) : (
        <div>
          <MenuBar projectTitle={projectName} />

          <div className="navbar">
            <div className="new-project">
              <Popover placement="bottom" content={content} trigger="click">
                <Button className="newbtn">
                  <PlusOutlined />
                  New
                </Button>
              </Popover>
            </div>
          </div>
          {/* // Progress Bar */}

          {/* Kanban Board */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="kanban-board">
              {Object.keys(statusColumns).map((status) => (

                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      // ${status.toLowerCase()}
                      className={`kanban-column`}
                      ref={provided.innerRef}
                    >
                      <div className='k-card-flex'>
                        <Title className='card-status pr-clr'>{status}</Title>
                        <img className='k-status-icon' src={statusColumns[status].img} alt='title-pic' />
                      </div>
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
                                className={`task-card ${status.toLowerCase()}`}
                              >
                                <Title className={`k-card-title  ${statusTitleclr[task.status]}`}>{task.title}</Title>
                                <p className='fnt mb-10'>Creation Date:
                                  {task.timestamp instanceof Date
                                    ? task.timestamp.toLocaleDateString()
                                    : task.timestamp && task.timestamp.toDate instanceof Function
                                      ? task.timestamp.toDate().toLocaleDateString()
                                      : task.timestamp && task.timestamp.seconds
                                        ? new Date(task.timestamp.seconds * 1000).toLocaleDateString()
                                        : ''}</p>
                                <div className='t-card-body'>


                                  <div className={`task-status-container ${statusClr[task.status]}`}>
                                    <Text className='task-status'>{task.status}</Text>
                                  </div>
                                  <DeleteOutlined onClick={() => {
                                    handleDeleteTask(task.id)
                                  }} />
                                </div>
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

          {loading && <Alert className="alert-message" message=" Loading..." type="success" />}
        </div >
      )}
      <FloatButton
        shape="circle"
        type="primary"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          navigate(`/dashboard/project/${userId}`)
        }}
        style={{
          right: 50,
        }}
      />

    </div >
  );
};

export default TaskPage;