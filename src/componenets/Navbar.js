import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>🌟 MyProject</div>
      <div style={styles.userSection}>
        <div style={styles.welcome}>Welcome, {username || 'Guest'}</div>
        {username && (
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2e2e2e',
    color: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: '16px',
    marginRight: '15px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;