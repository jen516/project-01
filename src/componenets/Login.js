import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('username', username);
        navigate('/home'); // Assuming <Route path="/home" element={<Home />} />
      } else {
        setError(result.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
        <GoogleOAuthProvider clientId="978593254370-er4g07bugc89umteqj21vbpq2c42s139.apps.googleusercontent.com">
        <h2 style={{ textAlign: 'center' }}>OR</h2>
     
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            const decoded = jwtDecode(credentialResponse.credential);
            console.log(decoded);
            localStorage.setItem('username', decoded.name);
            localStorage.setItem('email', decoded.email);
            localStorage.setItem('profile', decoded.picture);
            navigate('/home');
          }}


          onError={() => {
            console.log('Login Failed')
          }}
        />
      </GoogleOAuthProvider>
      </form>

     
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1e1e1e',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    background: '#2e2e2e',
    padding: '30px',
    borderRadius: '10px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    backgroundColor: '#555',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center',
  },
};

export default Login;
