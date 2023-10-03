import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Input, Modal, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createProject, fetchProjects, updateProject, deleteProject } from '../services/api';
import { Link } from 'react-router-dom';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    status: 'In Progress',
    members: '',
    progress: 0,
  });
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
      client: '',
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
        StartDate: editingStartDate !== null ? editingStartDate : currentProject.StartDate,
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
    const { title, client, status, members, progress } = project;

    let color = 'red';
    if (progress >= 50) {
      color = 'yellow';
    }
    if (progress === 100) {
      color = 'green';
    }

    return (
      <div className="card-render" key={project.id}>
        <Card>
          <div className="card-header">
            <h1>
              <Link to={`/tasks/`}>{title}</Link>
            </h1>
            <div className="icon">
              <Button type="text" onClick={() => handleEdit(project.id)}>
                Edit
              </Button>
              <Button type="text" onClick={() => handleDelete(project.id)}>
                Delete
              </Button>
            </div>
          </div>
          <div className="attribute">
  <p>Start Date</p>
  {editingProjectId === project.id ? (
    <Input
      name="StartDate"
      value={editingStartDate !== null ? editingStartDate : ''}
      onChange={(e) => setEditingStartDate(e.target.value)}
    />
  ) : (
    <p>{localStorage.getItem(`startDate_${project.id}`) || project.StartDate}</p>
  )}
</div>
          <div className="attribute">
            <p>Status</p>
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
              <p>{status}</p>
            )}
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
          {editingProjectId === project.id ? (
            <Button type="primary" onClick={handleUpdate}>
              Update
            </Button>
          ) : null}

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
              <Button type="primary">Task</Button>
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
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="project-title">
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

      <div className="card">
        {projects.map((project) => (
          <div key={project.id}>
            {cardRender(project)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
