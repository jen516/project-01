import React from 'react';

const Navbar = () => {
  const username = localStorage.getItem('username');

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>🌟 MyProject</div>
      <div style={styles.welcome}>Welcome, {username}</div>
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
  },
};

export default Navbar;
