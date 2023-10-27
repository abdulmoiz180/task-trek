import "./project.css";
import headerStyles from '../../styles/headerStyles';
import React, { useState, useEffect, useRef } from "react";
import { Card, Progress, Button, Input, Modal, List, Menu, Popover } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import EditSvg from "../../assets/images/edit-pencil 1.svg";
import redDotSvg from "../../assets/images/Ellipse red.svg";
import greenDotSvg from "../../assets/images/Ellipse 12.svg";
import yellowDotSvg from "../../assets/images/Ellipse yellow.svg";
import Line3 from "../../assets/images/Line 3.png";
import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
  fetchTasksForProject,
} from "../../services/api";
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate,useParams } from "react-router-dom";
import { db } from '../../utils/constants/Firebase';

import { useSearch, useMenuContext } from "../../contexts/SearchContext";
import TaskPage from "../taskpage/TaskPage";

const Project = () => {
  const { userId } = useParams();
  const navigate = useNavigate()
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    status: 'In Progress',
    members: '',
    progress: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [showInputFields, setShowInputFields] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingStartDate, setEditingStartDate] = useState(null);
  const [editingMembers, setEditingMembers] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');


  // for fetching project
  useEffect(() => {
    async function fetchProjectData() {
      const projectList = await fetchProjects(userId);
      setProjects(projectList);
    }
    fetchProjectData();
  }, [userId]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleTaskInputChange = (e) => {
    setTaskText(e.target.value);
  };

  const handleTaskAdd = () => {
    if (taskText.trim() !== "") {
      setTaskList([...taskList, taskText]);
      setTaskText("");
    }
  };

  const handleTaskDelete = (index) => {
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // useRef
    // const docRef = doc(db, "projects", docId.current.value);
    // await setDoc(docRef, { docId: docId.current.value });

    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
    setShowInputFields(true);
    setTaskModalVisible(false);
    try {
      await createProject({ ...newProject, tasks: taskList, userId });
      setNewProject({
        title: '',
        client: '',
        status: 'In Progress',
        members: '',
        progress: 0,
      });
      setTaskList([]);
      const updatedProjectList = await fetchProjects(userId);
      setProjects(updatedProjectList);
      setShowInputFields(false);
      setTaskModalVisible(false);
    } catch (error) {
      console.error('Error creating project: ', error);
      // Handle error here
    }
  };

  const handleDelete = async (projectId) => {
    // console.log(projectId)
    await deleteProject(projectId);
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
  };

  const handleEdit = (projectId) => {
    setEditingProjectId(projectId);
  };

  const handleUpdate = async () => {
    if (editingProjectId !== null) {
      const currentProject = projects.find(
        (project) => project.id === editingProjectId
      );
      const updatedProject = {
        ...currentProject,
        title:
          editingTitle !== null ? editingTitle : currentProject.title,
        StartDate:
          editingStartDate !== null
            ? editingStartDate
            : currentProject.StartDate,
        members:
          editingMembers !== null ? editingMembers : currentProject.members,
        status: newProject.status,
        progress: newProject.progress,
      };
      await updateProject(editingProjectId, updatedProject);
      setEditingProjectId(null);
      const updatedProjectList = await fetchProjects();
      setProjects(updatedProjectList);
    }
  };

  const toggleInputFields = () => {
    setShowInputFields(!showInputFields);
  };

  const toggleTaskModal = () => {
    setTaskModalVisible(!taskModalVisible);
  };
  const updateProjectInState = (projectId, updatedProject) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  const handleStatusFilterChange = ({ key }) => {
    // console.log("Selected Status:", selectedStatus);
    setMenuFilter(key);
  };

  const { searchQuery } = useSearch(); // Access the searchQuery from the context
  const { menuFilter, setMenuFilter } = useMenuContext();

  // create project input content
  const content = (
    <div>

      <form onSubmit={handleSubmit}>
        <div >
          <p>Project Title</p>
          <Input
            name="title"
            required
            value={newProject.title}
            onChange={handleInputChange}
            placeholder="Project Title"
          />
        </div>
        <Button className="newbtn createbtn" type="primary" htmlType="submit">
          Create
        </Button>
      </form>


    </div>

  )

  //--------------------------card Render function--------------------------------------
  const cardRender = (project) => {
    const { title, status, members, progress } = project;

    let statusImg = redDotSvg;
    let statusColor = "red";
    if (status === "Completed") {
      statusImg = greenDotSvg;
      statusColor = "green";
    } else if (status === "On Hold" || status === "Review") {
      statusImg = yellowDotSvg;
      statusColor = "yellow";
    }

    let color = "red";
    if (progress >= 50) {
      color = "yellow";
    }
    if (progress === 100) {
      color = "green";
    }

    const filteredBySearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const filteredByMenu =
      menuFilter === "All" || project.status === menuFilter;
    if (filteredBySearch && filteredByMenu)
      return (
        <div className="card-render" key={project.id}>
          <Card>
            <div className="card-header">
              {editingProjectId === project.id ? (
                <Input
                  type="text"
                  name="title"
                  value={editingTitle !== null ? editingTitle : ""}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
              ) : (<h1>{title}</h1>)}
              <div className="icon">
                {editingProjectId === project.id ? (
                  <Button onClick={handleUpdate} className="updatebtn" >
                    Update
                  </Button>
                ) : (
                  <div className="padding">
                    <Button
                      className="padding"
                      type="text"
                      onClick={() => handleEdit(project.id)}
                    >
                      <span>
                        <img src={EditSvg} alt="edit icon" />
                      </span>
                    </Button>
                    <Button
                      className="padding"
                      type="text"
                      onClick={() => handleDelete(project.id)}
                    >
                      <span>
                        <DeleteOutlined />
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="status">
              <span>
                <img src={statusImg} alt="dot" />
              </span>
              {editingProjectId === project.id ? (
                <select
                  name="status"
                  value={newProject.status}
                  onChange={(e) => {
                    setNewProject({ ...newProject, status: e.target.value });
                  }}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Discussing">Discussing</option>
                  <option value="Completed">Completed</option>
                  <option value="Review">Review</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="On Hold">On Hold</option>
                </select>
              ) : (
                <p className={statusColor}>{status}</p>
              )}
            </div>
            <div className="Task-area">
              {/* start date */}
              <div className="startDate">
                <p>Start Date</p>
                {editingProjectId === project.id ? (
                  <Input
                    type="date"
                    name="StartDate"
                    value={editingStartDate !== null ? editingStartDate : ""}
                    onChange={(e) => setEditingStartDate(e.target.value)}
                  />
                ) : (
                  <p>
                    {localStorage.getItem(`startDate_${project.id}`) ||
                      project.StartDate}
                  </p>
                )}
              </div>
              {/* tasks box */}
              <div className="tasks-box">
                <div className="tasks">
                  <p style={{ marginLeft: "8px" }}>{tasks.length}</p>
                  {tasks && tasks.length > 0 && (
                    <div className="task-list" key={project.id}>
                      <List
                        dataSource={project.tasks}
                        renderItem={(task, index) => (
                          <List.Item key={index}>
                            {task}
                            <Button
                              type="text"
                              onClick={() => handleTaskDelete(index)}
                            >
                              Delete
                            </Button>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                  <div className="task-input">
                    <Link to={`/${project.id}/tasks`}>
                      <p >Tasks</p>
                    </Link>
                    <Modal
                      title="Add Task"
                      open={taskModalVisible}
                      onOk={handleTaskAdd}
                      onCancel={toggleTaskModal}
                    >
                      <Input
                        placeholder="Task Name"
                        value={taskText}
                        onChange={handleTaskInputChange}
                      />
                    </Modal>
                  </div>
                </div>
                <div className="line3">
                  <img src={Line3} alt="line3" />
                </div>

                <div className="users">
                  <p style={{ marginLeft: "12px" }}>{4}</p>
                  <p>Users</p>
                </div>
              </div>
            </div>

            <div className="attribute">
              <p>Members</p>
              {editingProjectId === project.id ? (
                <Input
                  name="members"
                  value={editingMembers !== null ? editingMembers : members}
                  onChange={(e) => setEditingMembers(e.target.value)}
                />
              ) : (
                <p>{members}</p>
              )}
            </div>
            <div className="attribute">
              <p>Progress</p>
              {editingProjectId === project.id ? (
                <Input
                  type="number"
                  name="progress"
                  value={newProject.progress}
                  onChange={(e) => {
                    setNewProject({
                      ...newProject,
                      progress: parseInt(e.target.value),
                    });
                  }}
                />
              ) : (
                <div className="progress-bar">
                  <Progress percent={progress} strokeColor={color} />
                </div>
              )}
            </div>
          </Card>
        </div>
      );
  };

  return (
    <div>

      {/*------------------------ Navbar filteration -----------------------------------*/}
      <div className="navbar">
        <div className="new-project">
          <Popover placement="bottom" content={content}>
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
      {/* ----------------------------card render-------------------------------- */}
      <div className="card">
        {projects.map((project) => (
          <>
            <div key={project.id}>{cardRender(project)}</div>
          </>
        ))}

      </div>

    </div>
  );
};

export default Project;

