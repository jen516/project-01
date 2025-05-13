// import React, { useState, useEffect } from 'react';

// const Modal = ({ isOpen, onClose, task, onSave, onDelete }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [selectedUser, setSelectedUser] = useState('Alex');
//   const [assignedUser, setAssignedUser] = useState('Alex');
//   const [users, setUsers] = useState(['Alex', 'Ace', 'Luna']);

//   useEffect(() => {
//     if (task) {
//       setTitle(task.title || '');
//       setDescription(task.description || '');
//       setComments(task.comments || []);
//       setAssignedUser(task.assignedUser || 'Alex');
//     } else {
//       setTitle('');
//       setDescription('');
//       setComments([]);
//       setAssignedUser('Alex');
//     }
//   }, [task]);

//   const handleUserChange = (e) => {
//     const value = e.target.value;
//     if (value === 'add-more') {
//       const newName = prompt("Enter new user's name:");
//       if (newName && newName.trim()) {
//         const name = newName.trim();
//         if (!users.includes(name)) {
//           setUsers([...users, name]);
//         }
//         setSelectedUser(name);
//         setAssignedUser(name);
//       } else {
//         setSelectedUser('Alex');
//         setAssignedUser('Alex');
//       }
//     } else {
//       setSelectedUser(value);
//       setAssignedUser(value);
//     }
//   };

//   const handleCommentKeyPress = (e) => {
//     if (e.key === 'Enter' && newComment.trim()) {
//       setComments([...comments, { user: selectedUser, text: newComment.trim() }]);
//       setNewComment('');
//     }
//   };

//   const handleSave = () => {
//     onSave({ title, description, comments, assignedUser });
//   };

//   return (
//     <div className={`modal ${isOpen ? '' : 'hidden'}`}>
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>×</span>

//         <input
//           type="text"
//           placeholder="Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <textarea
//           placeholder="Task Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <label htmlFor="assignedUserSelect">Assign To:</label>
//         <select
//           id="assignedUserSelect"
//           value={assignedUser}
//           onChange={(e) => setAssignedUser(e.target.value)}
//         >
//           {users.map((user) => (
//             <option key={user} value={user}>{user}</option>
//           ))}
//           <option value="add-more">➕ Add more...</option>
//         </select>

//         <div className="comment-section">
//           <label>User for Comment:</label>
//           <select
//             value={selectedUser}
//             onChange={handleUserChange}
//           >
//             {users.map((user) => (
//               <option key={user} value={user}>{user}</option>
//             ))}
//             <option value="add-more">➕ Add more...</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Type a comment and press Enter"
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             onKeyPress={handleCommentKeyPress}
//           />

//           <div className="comments-feed">
//             {comments.map((comment, index) => (
//               <div key={index} className="comment">
//                 <strong>{comment.user}</strong>{comment.text}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="modal-actions">
//           <button onClick={handleSave}>Save</button>
//           {task && <button onClick={onDelete}>Delete</button>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;


import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, onClose, task, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:4000/users');
        const data = await res.json();
        setUsers(data);
        if (data.length > 0) {
          setSelectedUserId(data[0].id);
          setAssignedUserId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setComments(task.comments || []);
      setAssignedUserId(task.assignedTo?.id || '');
    } else {
      setTitle('');
      setDescription('');
      setComments([]);
      setAssignedUserId(users.length > 0 ? users[0].id : '');
    }
  }, [task, users]);

  const handleCommentKeyPress = async (e) => {
    if (e.key === 'Enter' && newComment.trim() && task?.id && selectedUserId) {
      try {
        const res = await fetch(`http://localhost:4000/tasks/${task.id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: newComment.trim(), userId: selectedUserId }),
        });
        if (!res.ok) throw new Error('Failed to post comment');
        const added = await res.json();
        setComments([...comments, added]);
        setNewComment('');
      } catch (err) {
        console.error('Failed to post comment:', err);
      }
    }
  };

  const handleSave = () => {
    onSave({
      title,
      description,
      assignedToId: assignedUserId,
    });
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
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username || user.email}
            </option>
          ))}
        </select>

        <div className="comment-section" style={{ marginTop: '20px' }}>
          <label>Comment as:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username || user.email}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Write a comment and press Enter"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleCommentKeyPress}
          />

          <div className="comments-feed" style={{ marginTop: '15px' }}>
            <h4>Comments</h4>
            {comments.length === 0 ? (
              <p style={{ fontStyle: 'italic' }}>No comments yet.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {comments.map((comment, index) => (
                  <li key={index}>
                    <strong>{comment.user?.username || comment.user?.email}:</strong> {comment.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button onClick={handleSave}>Save</button>
          {task && <button onClick={onDelete}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;