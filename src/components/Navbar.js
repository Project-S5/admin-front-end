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
    navigate('/');
  };

  const handleRegister = () => {
    // Redirect to the registration page (e.g., '/register-professor')
    navigate('/register-professor');
  };
  const handleDashboard = () => {
    // Redirect to the registration page (e.g., '/register-professor')
    navigate('/admin-dashboard');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content navbar-right">
        <button className="register-btn" onClick={handleDashboard}>Dashboard</button>
        <button className="register-btn" onClick={handleRegister}>Register a Professor</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      
      </div>
    </nav>
  );
};

export default Navbar;
