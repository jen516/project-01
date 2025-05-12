import React from 'react';

const Task = ({ task, setDraggedTask, openModal }) => {
  const handleDragStart = () => {
    setDraggedTask(task);
  };

  return (
    <div
      className="task"
      draggable
      onDragStart={handleDragStart}
      onClick={() => openModal(task)}>
      {task.title}
    </div>
  );
};

export default Task;