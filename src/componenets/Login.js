import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }
    // Placeholder for authentication logic
    // In a real app, this would make an API call to verify credentials
    console.log('Login attempted with:', { username, password });
    setError('');
    // Redirect to Task Manager or update app state here
    // e.g., window.location.href = 'index.html';
  };

  return (
    <div className="login-container">
      <h2>Task Manager Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;