import React, { useState, useEffect } from 'react';
import Column from './Column';
import Modal from './Modal';
import Navbar from './Navbar';

const Board = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetch('http://localhost:4000/tasks', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      const organizedTasks = {
        todo: data.filter((task) => task.columnId === 'todo'),
        inProgress: data.filter((task) => task.columnId === 'inProgress'),
        done: data.filter((task) => task.columnId === 'done'),
      };
      setTasks(organizedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const openModal = (task = null) => {
    setCurrentTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTask(null);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (currentTask) {
        // Update existing task
        const res = await fetch(`http://localhost:4000/tasks/${currentTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            assignedToId: taskData.assignedToId,
            columnId: currentTask.columnId,
          }),
        });
        if (!res.ok) throw new Error('Failed to update task');
        const updatedTask = await res.json();
        setTasks((prev) => ({
          ...prev,
          [currentTask.columnId]: prev[currentTask.columnId].map((task) =>
            task.id === currentTask.id ? updatedTask : task
          ),
        }));
      } else {
        // Create new task
        const res = await fetch('http://localhost:4000/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            assignedToId: taskData.assignedToId,
            columnId: 'todo',
          }),
        });
        if (!res.ok) throw new Error('Failed to create task');
        const newTask = await res.json();
        setTasks((prev) => ({
          ...prev,
          todo: [...prev.todo, newTask],
        }));
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!currentTask || !currentTask.id) {
      console.error('No task or task ID provided for deletion');
      return;
    }

    console.log('Attempting to delete task:', currentTask);

    try {
      const res = await fetch(`http://localhost:4000/tasks/${currentTask.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to delete task: ${errorData.error || res.statusText}`);
      }

      setTasks((prev) => ({
        ...prev,
        [currentTask.columnId]: prev[currentTask.columnId].filter(
          (task) => task.id !== currentTask.id
        ),
      }));
      closeModal();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleDrop = async (columnId) => {
    if (draggedTask) {
      const sourceColumn = draggedTask.columnId;
      try {
        const res = await fetch(`http://localhost:4000/tasks/${draggedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: draggedTask.title,
            description: draggedTask.description,
            assignedToId: draggedTask.assignedToId,
            columnId,
          }),
        });
        if (!res.ok) throw new Error('Failed to update task column');
        const updatedTask = await res.json();
        setTasks((prev) => ({
          ...prev,
          [sourceColumn]: prev[sourceColumn].filter(
            (task) => task.id !== draggedTask.id
          ),
          [columnId]: [...prev[columnId], updatedTask],
        }));
        setDraggedTask(null);
      } catch (error) {
        console.error('Error moving task:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="board">
        <Column
          id="todo"
          title="To Do"
          tasks={tasks.todo}
          onAddTask={() => openModal()}
          onDrop={handleDrop}
          setDraggedTask={setDraggedTask}
          openModal={openModal}
        />
        <Column
          id="inProgress"
          title="In Progress"
          tasks={tasks.inProgress}
          onDrop={handleDrop}
          setDraggedTask={setDraggedTask}
          openModal={openModal}
        />
        <Column
          id="done"
          title="Done"
          tasks={tasks.done}
          onDrop={handleDrop}
          setDraggedTask={setDraggedTask}
          openModal={openModal}
        />
        <Modal
          isOpen={modalOpen}
          onClose={closeModal}
          task={currentTask}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </>
  );
};

export default Board;