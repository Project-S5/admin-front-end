import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import CSS file for styling

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register-professor');
  };

  const handleDashboard = () => {
    navigate('/admin-dashboard');
  };

  const handleSubjectsPerGroup = () => {
    navigate('/subjects-per-group');
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <button className="navbar__button" onClick={handleDashboard}>
          Home
        </button>
        <button className="navbar__button" onClick={handleSubjectsPerGroup}>
          Subjects Per Group
        </button>
        <button className="navbar__button" onClick={handleRegister}>
          Register a Professor
        </button>
      </div>
      <div className="navbar__right">
        <button className="navbar__button navbar__button--logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
