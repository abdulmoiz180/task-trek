import React, { useState, useEffect } from 'react';
import { Card, Progress, List, Button, Modal, Input } from 'antd'; 
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {createProject, fetchProjects, updateProject, deleteProject,} from '../../services/api';
import EditSvg from '../../assets/images/edit-pencil 1.svg';
import redDotSvg from '../../assets/images/Ellipse red.svg';
import greenDotSvg from '../../assets/images/Ellipse 12.svg';
import yellowDotSvg from '../../assets/images/Ellipse yellow.svg';
import Line3 from '../../assets/images/Line 3.png';
import './project.css';
import AppHeader from '../../layout/MenuBar';
import { Link } from 'react-router-dom';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    start_Date: '',
    status: 'In Progress', 
    members: '',
    progress: 0, 
  });
  // const [editingProject, setEditingProject] = useState(null);

  const [showInputFields, setShowInputFields] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null); 
  const [editingStartDate, setEditingStartDate] = useState(null); 
  const [editingMembers, setEditingMembers] = useState(null); 

  useEffect(() => {
    async function fetchProjectData() {
      const projectList = await fetchProjects();
      setProjects(projectList);
    }
    fetchProjectData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };
  const handleTaskInputChange = (e) => {
    setTaskText(e.target.value);
  };

  const handleTaskAdd = () => {
    if (taskText.trim() !== '') {
      setTaskList([...taskList, taskText]);
      setTaskText('');
    }
  };

  const handleTaskDelete = (index) => {
    const updatedTaskList = [...taskList];
    updatedTaskList.splice(index, 1);
    setTaskList(updatedTaskList);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject({ ...newProject, tasks: taskList });
    setNewProject({
      title: '',
      start_Date: '',
      status: 'In Progress',
      members: '',
      progress: 0,
    });
    setTaskList([]);
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
    setShowInputFields(false);
    setTaskModalVisible(false);
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId);
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
  };

  const handleEdit = (projectId) => {
    setEditingProjectId(projectId);
  };

  const handleUpdate = async () => {
    if (editingProjectId !== null) {
      const currentProject = projects.find((project) => project.id === editingProjectId);
      const updatedProject = {
        ...currentProject,
        Start_Date: editingStartDate !== null ? editingStartDate : currentProject.StartDate,
        members: editingMembers !== null ? editingMembers : currentProject.members,
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



  const cardRender = (project) => {
    const { title, start_Date, status, members, progress } = project;

let statusImg= redDotSvg;
let statusColor = 'red';
if(status === 'Completed'){
  statusImg= greenDotSvg;
  statusColor= 'green';
}
else if(status === 'On Hold' || status === 'Review'){
  statusImg= yellowDotSvg;
  statusColor = 'yellow';
}


    let color = 'red'; 
    if (progress >= 50) {
      color = 'light';
    }
    if (progress === 100) {
      color = 'green';
    }

    return (
      <div className="card-render" key={project.id}>
        <Card>
          {/* heading */}
          <div className="card-header">
            <h1>{title}</h1>
            <div className="icon">
            {editingProjectId === project.id ? (
            <button type="primary" onClick={handleUpdate}>
              Update
            </button>
           ) : (
            <div>
            <button onClick={() => handleEdit(project.id)}>
            <span> <img src={EditSvg} alt="edit icon"  /> </span>
            </button>
            <button onClick={() => handleDelete(project.id)}>
              <span> <DeleteOutlined /> </span>
            </button>
            </div>
           )}

           
            </div>
          </div>
                {/* status */}
          <div className="status">
             <span> <img src={statusImg} alt='dot'/> </span>
             {editingProjectId === project.id ? (
              <select
                name="status"
                value={newProject.status}
                onChange={(e) => {
                  setNewProject({ ...newProject, status: e.target.value });
                }}
              >
                {/* Options for status */}
                <option value="In Progress" >In Progress</option>
                <option value="Discussing">Discussing</option>
                <option  value="Completed">Completed</option>
                <option value="Review">Review</option>
                <option value="Cancelled">Cancelled</option>
                <option  value="On Hold">On Hold</option>
              </select>
            ) : (
              <p className={statusColor}  >{status}</p>
            )}
          </div>
          <div className="Task-area">
          {/* start date */}
          <div className="startDate">
            <p>Start Date</p>
            {editingProjectId === project.id ? (
            <input
              type="date"
              name="start_Date"
              value={editingStartDate !== null ? editingStartDate : ''}
              onChange={(e) => setEditingStartDate(e.target.value)}
            />
            ) : (
              <p>{localStorage.getItem(`startDate_${project.id}`) || project.StartDate}</p>
            )}
          </div>
              <div className="tasks-box">
                <div className="tasks">
                  <p style={{ marginLeft: "8px"}}>{ 14 }</p>
                  {project.tasks && project.tasks.length > 0 && (
            <div className="task-list">
              <h3>Tasks:</h3>
              <List
                dataSource={project.tasks}
                renderItem={(task, index) => (
                  <List.Item key={index}>
                    {task}
                    <Button type="text" onClick={() => handleTaskDelete(index)}>
                      Delete
                    </Button>
                  </List.Item>
                )}
              />
            </div>
          )}
          <div className="task-input">
            <Link to="/tasks">
               <p>Tasks</p>
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
                  <p style={{ marginLeft: "12px"}}>{4}</p>
                  <p>Users</p>
                </div>

              </div>



          </div>
         {/* members */}
          <div className="attribute">
            <p>Members</p>
            {editingProjectId === project.id ? (
            <input
              type="text"
              name="members"
              value={editingMembers !== null ? editingMembers : members}
              onChange={(e) => setEditingMembers(e.target.value)}
            />
            ) : (
              <p>{members}</p>
            )}
          </div>
          {/* progress */}
          <div className="attribute">
            <p>Progress</p>
            {editingProjectId === project.id ? (
              <input
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
      <AppHeader/>
      <div>
      <h1>Projects</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={toggleInputFields}>
          New Project
        </Button>
      </div>
      {showInputFields && (
        <form onSubmit={handleSubmit}>
          <div className="attribute">
            <p>Project Title</p>
            <Input
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
              placeholder="Project Title"
            />
          </div>
          <Button type="primary" htmlType="submit">
            Create Project
          </Button>
        </form>
      )}
      

      <div className="card">{projects.map((project) => cardRender(project))}</div>
    </div>
  );
};

export default Project;