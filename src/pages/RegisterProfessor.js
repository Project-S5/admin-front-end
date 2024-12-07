import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Navbar from '../components/Navbar'; // Import Navbar component
import './RegisterProfessor.css'; // Import the CSS file for styling

const RegisterProfessor = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();  // Initialize navigate function

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('access_token');  // Retrieve access token from localStorage

    if (!accessToken) {
      alert('No access token found, please log in first.');
      return;
    }

    try {
      // API call to register the professor with the Authorization header
      const response = await fetch('http://localhost:8000/api/register/professor/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Add the access token to the Authorization header
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      // If the response is not OK, throw an error
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register professor');
      }

      // If the registration is successful, log the response
      const data = await response.json();
      console.log('Professor registered successfully:', data);
      
      // Redirect to the admin dashboard
      navigate('/admin-dashboard');  // Redirect to the admin dashboard page after success

    } catch (error) {
      console.error('Error:', error.message);
      // Show error message (could be updated to a UI alert or modal)
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="register-professor">
      <Navbar /> {/* Include the Navbar component */}
      <h2>Register a Professor</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterProfessor;
