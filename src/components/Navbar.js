// Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import CSS file for styling

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all relevant session data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
