import React, { useState, useEffect } from 'react';
import { Card, Progress } from 'antd'; 
import { DeleteOutlined } from '@ant-design/icons';
import {createProject, fetchProjects, updateProject, deleteProject,} from '../../services/api';
import EditSvg from '../../assets/images/edit-pencil 1.svg';
import redDotSvg from '../../assets/images/Ellipse red.svg';
import greenDotSvg from '../../assets/images/Ellipse 12.svg';
import yellowDotSvg from '../../assets/images/Ellipse yellow.svg';
import Line3 from '../../assets/images/Line 3.png';
import './project.css';
import AppHeader from '../../layout/MenuBar';


const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    start_Date: '',
    status: 'In Progress', 
    members: '',
    progress: 0, 
  });
  const [editingProject, setEditingProject] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject(newProject);
    setNewProject({
      title: '',
      client: '',
      status: 'In Progress', 
      members: '',
      progress: 0, 
    });
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
  };

  const handleDelete = async (projectId) => {
    await deleteProject(projectId);
    const updatedProjectList = await fetchProjects();
    setProjects(updatedProjectList);
  };

  const handleEdit = (projectId) => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    setEditingProject(projectToEdit);
  };

  const handleUpdate = async () => {
    if (editingProject) {
      await updateProject(editingProject.id, editingProject);
      setEditingProject(null);
      const updatedProjectList = await fetchProjects();
      setProjects(updatedProjectList);
    }
  };

  const cardRender = (project) => {
    const { title, start_Date, status, members, progress } = editingProject || project;

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
            {editingProject ? (
            <button onClick={handleUpdate}>Update</button>
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
            {editingProject ? (
              <select
                name="status"
                value={status}
                onChange={(e) => {
                  setEditingProject({ ...editingProject, status: e.target.value });
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
            <input
              type="date"
              name="client"
              value={start_Date}
              onChange={(e) => {
                if (editingProject) {
                  setEditingProject({ ...editingProject, start_Date: e.target.value });
                }
              }}
            />
          </div>
              <div className="tasks-box">
                <div className="tasks">
                  <p style={{ marginLeft: "8px"}}>{ 14 }</p>
                  <p>Tasks</p>
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
            <input
              type="text"
              name="members"
              value={members}
              onChange={(e) => {
                if (editingProject) {
                  setEditingProject({ ...editingProject, members: e.target.value });
                }
              }}
            />
          </div>
          {/* progress */}
          <div className="attribute">
            <p>Progress</p>
            {editingProject ? (
              <input
                type="number"
                name="progress"
                value={progress}
                onChange={(e) => {
                  setEditingProject({ ...editingProject, progress: parseInt(e.target.value) });
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

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newProject.title}
          onChange={handleInputChange}
          placeholder="Project Title"
        />
        <button type="submit">Create Project</button>
      </form>

      <div className="card">{projects.map((project) => cardRender(project))}</div>
    </div>
  );
};

export default Project;