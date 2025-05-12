import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedUser, setSelectedUser] = useState('Alex');
  const [assignedUser, setAssignedUser] = useState('Alex');
  const [users, setUsers] = useState(['Alex', 'Ace', 'Luna']);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setComments(task.comments || []);
      setAssignedUser(task.assignedUser || 'Alex');
    } else {
      setTitle('');
      setDescription('');
      setComments([]);
      setAssignedUser('Alex');
    }
  }, [task]);

  const handleUserChange = (e) => {
    const value = e.target.value;
    if (value === 'add-more') {
      const newName = prompt("Enter new user's name:");
      if (newName && newName.trim()) {
        const name = newName.trim();
        if (!users.includes(name)) {
          setUsers([...users, name]);
        }
        setSelectedUser(name);
        setAssignedUser(name);
      } else {
        setSelectedUser('Alex');
        setAssignedUser('Alex');
      }
    } else {
      setSelectedUser(value);
      setAssignedUser(value);
    }
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && newComment.trim()) {
      setComments([...comments, { user: selectedUser, text: newComment.trim() }]);
      setNewComment('');
    }
  };

  const handleSave = () => {
    onSave({ title, description, comments, assignedUser });
  };

  return (
    <div className={`modal ${isOpen ? '' : 'hidden'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>×</span>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="assignedUserSelect">Assign To:</label>
        <select
          id="assignedUserSelect"
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
        >
          {users.map((user) => (
            <option key={user} value={user}>{user}</option>
          ))}
          <option value="add-more">➕ Add more...</option>
        </select>

        <div className="comment-section">
          <label>User for Comment:</label>
          <select
            value={selectedUser}
            onChange={handleUserChange}
          >
            {users.map((user) => (
              <option key={user} value={user}>{user}</option>
            ))}
            <option value="add-more">➕ Add more...</option>
          </select>

          <input
            type="text"
            placeholder="Type a comment and press Enter"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleCommentKeyPress}
          />

          <div className="comments-feed">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.user}</strong>{comment.text}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          {task && <button onClick={onDelete}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
