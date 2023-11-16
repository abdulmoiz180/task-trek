import React, { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Modal, Menu, Popover, Alert } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSearch, useMenuContext } from "../../contexts/SearchContext";
import headerStyles from "../../styles/headerStyles";
import "./taskPage.css";
import redDotSvg from "../../assets/images/Ellipse red.svg";
import greenDotSvg from "../../assets/images/Ellipse 12.svg";
import yellowDotSvg from "../../assets/images/Ellipse yellow.svg";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  addDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../utils/constants/Firebase";
import dbNames from "../../utils/constants/db";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus } from "../../redux/taskSlice";

const TaskPage = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const docId = useRef();
  const [newTask, setNewTask] = useState({
    title: "",
    assigned: "",
    status: "todo",
    column: "",
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
      console.error("Error fetching projects: ", error);
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
    if (newTask.title.trim() !== "") {
      const collectionName = dbNames.getTaskCollection(projectId);
      const taskRef = collection(db, collectionName);
      const newTaskData = {
        title: newTask.title,
        projectId: projectId,
        assigned: newTask.assigned,
        status: newTask.status,
        column: newTask.column,
      };

      if (docId && docId.current && docId.current.value) {
        const docRef = doc(db, collectionName, docId.current.value);
        await setDoc(docRef, newTaskData);
      } else {
        await addDoc(taskRef, newTaskData);
      }

      setTasks([...tasks, newTask]);

      setNewTask({
        title: "",
        assigned: "",
        status: "todo",
        column: "todo",
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
      console.error("Error deleting task:", error);
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
      console.log(updatedTasks);
      updatedTasks[editedTaskIndex] = editedTask;
      setTasks(updatedTasks);

      try {
        const collectionName = dbNames.getTaskCollection(projectId);
        const taskRef = doc(db, collectionName, editedTask.id);
        await setDoc(taskRef, editedTask);
        // Dispatch the updateTaskStatus action
        dispatch(
          updateTaskStatus({
            taskId: editedTask.id,
            newStatus: editedTask.status,
          })
        );

        console.log("Dispatched updateTaskStatus:", {
          taskId: editedTask.id,
          newStatus: editedTask.status,
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }

      setEditModalVisible(false);
      setEditedTask({});
      setEditedTaskIndex(null);
    }
  };
  const dispatch = useDispatch();

  

  // const handleTaskStatus = (taskId, newStatus) =>{
  //   dispatch(updateTaskStatus({ taskId: taskId, newStatus: newStatus}));
  // }

  const content = (
    <div>
      <h1>Tasks</h1>
      <Input
        ref={docId}
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => {
          // const newStatus = e.target.value;
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
        <option value="todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <Button onClick={() => handleAddTask(projectId)}>Add Task</Button>
    </div>
  );

  let statusImg = redDotSvg;
  let statusColor = "red";
  if (newTask.status === "Completed") {
    statusImg = greenDotSvg;
    statusColor = "green";
  } else if (newTask.status === "On Hold" || newTask.status === "Review") {
    statusImg = yellowDotSvg;
    statusColor = "yellow";
  }

  // const handleStatusFilterChange = ({ key }) => {
  //   // console.log("Selected Status:", selectedStatus);
  //   setMenuFilter(key);
  // };
  const columns = [
    {
      id: "todo",
      title: "Todo",
    },
    {
      id: "In Progress",
      title: "In Progress",
    },
    {
      id: "completed",
      title: "Completed",
    },
  ];

  return (
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

      {/* kanbanboard */}
      <div className="kanban-board">
        {columns.map((col) => (
          <div key={col.id} className="col">
            {/* title */}
            <div className="col-title">
              <div>{tasks.filter((task) => task.status === col.id).length}</div>
              <div>{col.title}</div>
            </div>
            {/* content */}
            {/* Tasks rendering  */}
            
            <div className="tasks">
                {tasks
                  .filter((task) => task.status === col.id)
                  .map((task, index) => (
                    <Card key={index}>
                      <h2>{task.title}</h2>
                      <p>Assigned: {task.assigned}</p>
                      <div className="status">
                        {/* <span>
      <img src={statusImg} alt="dot" />{" "}
    </span> */}
                        <p>{task.status}</p>
                      </div>

                      <Button onClick={() => openEditModal(task, index)}>
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteTask(task.id)}>
                        Delete
                      </Button>
                    </Card>
                  ))}
             
            </div>
          </div>
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
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
        />
        <Input
          type="text"
          placeholder="Assigned"
          value={editedTask.assigned}
          onChange={(e) =>
            setEditedTask({ ...editedTask, assigned: e.target.value })
          }
        />
        <select
          value={editedTask.status}
          onChange={(e) =>
            setEditedTask({ ...editedTask, status: e.target.value })
          }
        >
          <option value="todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </Modal>
      {loading && (
        <Alert className="alert-message" message=" Loading..." type="success" />
      )}
    </div>
  );
};

export default TaskPage;
