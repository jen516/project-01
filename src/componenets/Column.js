import React from 'react';
import Task from './Task';

const Column = ({ id, title, tasks, onAddTask, onDrop, setDraggedTask, openModal }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = () => {
    onDrop(id);
  };

  return (
    <div className="column" id={id}>
      <h2>{title}</h2>
      <div className="task-list" onDragOver={handleDragOver} onDrop={handleDrop}>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={{ ...task, columnId: id }}
            setDraggedTask={setDraggedTask}
            openModal={openModal}
          />
        ))}
      </div>
      {id === 'todo' && (
        <button className="add-task" onClick={onAddTask}>
          + Add Task
        </button>
      )}
    </div>
  );
};

export default Column;