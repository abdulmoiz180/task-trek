import React, { useState } from 'react';
import { Card, Input, Button, Modal } from 'antd';

const TaskPage = () => {
  const [tasks, setTasks] = useState([
    {
      title: 'Front-End',
      assigned: 'Amna, Anum',
      status: 'In Progress',
    },
    {
      title: 'Back-End',
      assigned: 'Moiz, Fida',
      status: 'In Progress',
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    assigned: '',
    status: 'In Progress',
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({});
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);

  const handleAddTask = () => {
    if (newTask.title.trim() !== '') {
      setTasks([...tasks, newTask]);
      setNewTask({
        title: '',
        assigned: '',
        status: 'In Progress',
      });
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const openEditModal = (task, index) => {
    setEditedTask(task);
    setEditedTaskIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateTask = () => {
    if (editedTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editedTaskIndex] = editedTask;
      setTasks(updatedTasks);
      setEditModalVisible(false);
      setEditedTask({});
      setEditedTaskIndex(null);
    }
  };

  return (
    <div>
      <h1>Tasks</h1>
      <div>
        <Input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Assigned"
          value={newTask.assigned}
          onChange={(e) => setNewTask({ ...newTask, assigned: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="In Progress">In Progress</option>
                <option value="Discussing">Discussing</option>
                <option value="Completed">Completed</option>
                <option value="Review">Review</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
              </select>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <div>
        {tasks.map((task, index) => (
          <Card key={index}>
            <h2>{task.title}</h2>
            <p>Assigned: {task.assigned}</p>
            <p>Status: {task.status}</p>

            <Button onClick={() => openEditModal(task, index)}>Edit</Button>
            <Button onClick={() => handleDeleteTask(index)}>Delete</Button>
          </Card>
        ))}
      </div>
      <Modal
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
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </Modal>
    </div>
  );
};

export default TaskPage;
