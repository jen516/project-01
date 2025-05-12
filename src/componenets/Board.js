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

  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || {
      todo: [],
      inProgress: [],
      done: [],
    };
    setTasks(savedTasks);
  };

  const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const openModal = (task = null) => {
    setCurrentTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (currentTask) {
      // Update existing task
      const columnId = currentTask.columnId;
      setTasks((prev) => ({
        ...prev,
        [columnId]: prev[columnId].map((task) =>
          task.id === currentTask.id ? { ...task, ...taskData } : task
        ),
      }));
    } else {
      // Add new task to todo
      const newTask = { ...taskData, id: Date.now().toString() };
      setTasks((prev) => ({
        ...prev,
        todo: [...prev.todo, newTask],
      }));
    }
    saveTasks();
    closeModal();
  };

  const handleDeleteTask = () => {
    if (currentTask) {
      const columnId = currentTask.columnId;
      setTasks((prev) => ({
        ...prev,
        [columnId]: prev[columnId].filter((task) => task.id !== currentTask.id),
      }));
      saveTasks();
      closeModal();
    }
  };

  const handleDrop = (columnId) => {
    if (draggedTask) {
      const sourceColumn = draggedTask.columnId;
      const taskToMove = tasks[sourceColumn].find(
        (task) => task.id === draggedTask.id
      );
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter(
          (task) => task.id !== draggedTask.id
        ),
        [columnId]: [...prev[columnId], { ...taskToMove, columnId }],
      }));
      setDraggedTask(null);
      saveTasks();
    }
  };

  return (
    <>
    <Navbar></Navbar>
 
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