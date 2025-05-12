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
      onClick={() => openModal(task)}
    >
      <strong>{task.title}</strong>
      <p>{task.description}</p>
      {task.assignedUser && (
        <p style={{ fontSize: '0.8em', color: '#aaa' }}>
          👤 Assigned to: {task.assignedUser}
        </p>
      )}
    </div>
  );
};

export default Task;
