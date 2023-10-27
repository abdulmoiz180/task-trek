import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Modal, Menu, Popover, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSearch, useMenuContext } from "../../contexts/SearchContext";
import headerStyles from '../../styles/headerStyles';
import "./taskPage.css";
import redDotSvg from "../../assets/images/Ellipse red.svg";
import greenDotSvg from "../../assets/images/Ellipse 12.svg";
import yellowDotSvg from "../../assets/images/Ellipse yellow.svg";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query, addDoc
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../utils/constants/Firebase';
import dbNames from '../../utils/constants/db';

const TaskPage = () => {
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
      console.error('Error fetching projects: ', error);
    }

    return tasksList;
  };

  useEffect(() => {
    async function fetchTasksData() {
      const taskList = await fetchTasks(projectId);
      setTasks(taskList);
    }
    fetchTasksData();
  }, [projectId]);

  const q = collection(db, dbNames.projectCollection);
  const [docs, loading, error] = useCollectionData(q);

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

      if (docId && docId.current && docId.current.value) {
        const docRef = doc(db, collectionName, docId.current.value);
        await setDoc(docRef, newTaskData);
      } else {
        await addDoc(taskRef, newTaskData);
      }

      setTasks([...tasks, newTask]);

      setNewTask({
        title: '',
        assigned: '',
        status: 'In Progress',
      });
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

  const handleUpdateTask = async () => {
    if (editedTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editedTaskIndex] = editedTask;
      setTasks(updatedTasks);

      try {
        const collectionName = dbNames.getTaskCollection(projectId);
        const taskRef = doc(db, collectionName, editedTask.id);
        await setDoc(taskRef, editedTask);
      } catch (error) {
        console.error('Error updating task:', error);
      }

      setEditModalVisible(false);
      setEditedTask({});
      setEditedTaskIndex(null);
    }
  };


  const content = (
    <div>
      <h1>Tasks</h1>
      <Input
        ref={docId}
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => {
          setNewTask({ ...newTask, title: e.target.value })
        }}
      />
      <Input
        ref={docId}
        type="text"
        placeholder="Assigned"
        value={newTask.assigned}
        onChange={(e) => {
          setNewTask({ ...newTask, assigned: e.target.value })
        }
        }
      />
      <select
        value={newTask.status}
        ref={docId}
        onChange={(e) => {
          setNewTask({ ...newTask, status: e.target.value })
        }
        }
      >
        <option value="In Progress">In Progress</option>
        <option value="Discussing">Discussing</option>
        <option value="Completed">Completed</option>
        <option value="Review">Review</option>
        <option value="Cancelled">Cancelled</option>
        <option value="On Hold">On Hold</option>
      </select>
      <Button onClick={() => handleAddTask(projectId)}>Add Task</Button>
    </div>

  )

  let statusImg = redDotSvg;
  let statusColor = "red";
  if (newTask.status === "Completed") {
    statusImg = greenDotSvg;
    statusColor = "green";
  } else if (newTask.status === "On Hold" || newTask.status === "Review") {
    statusImg = yellowDotSvg;
    statusColor = "yellow";
  }

  const handleStatusFilterChange = ({ key }) => {
    // console.log("Selected Status:", selectedStatus);
    setMenuFilter(key);
  };

  const { menuFilter, setMenuFilter } = useMenuContext();

  // const filteredBySearch =
  // !searchQuery ||
  // newTask.title.toLowerCase().includes(searchQuery.toLowerCase());
  const filteredByMenu =
    menuFilter === "All" || newTask.status === menuFilter;
  if (filteredByMenu)
    return (
      <div>
        <div className="navbar">
          <div className="new-project">
            <Popover placement="bottom"
              content={content}
            >
              <Button className="newbtn">
                <PlusOutlined />
                New</Button>
            </Popover>
          </div>

          <div className="filterMenu">
            <Menu style={headerStyles.AdditonalMenuStyle} value={menuFilter} onClick={handleStatusFilterChange}>
              <Menu.Item key="All">All</Menu.Item>
              <Menu.Item key="In Progress">In Progress</Menu.Item>
              <Menu.Item key="On Hold">On Hold</Menu.Item>
              <Menu.Item key="Completed">Completed</Menu.Item>
            </Menu>

          </div>

        </div>

        {/* Tasks rendering  */}

        <div>

          {tasks.map((task, index) => (

            <Card key={index}>
              <h2>{task.title}</h2>
              <p>Assigned: {task.assigned}</p>
              <div className='status'>
                {/* <span>
                <img src={statusImg} alt="dot" />{" "}
              </span> */}
                <p >{task.status}</p>
              </div>

              <Button onClick={() => openEditModal(task, index)}>Edit</Button>
              <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
            </Card>
          ))}
        </div>
        <Modal
          title="Edit Task"
          open={editModalVisible}
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
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </Modal>
        {loading && <Alert className='alert-message' message=" Loading..." type="success" />}
      </div>
    );
};

export default TaskPage;