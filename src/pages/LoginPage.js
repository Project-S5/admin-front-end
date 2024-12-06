// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css'; // Custom CSS for styling
import { useNavigate } from 'react-router-dom'; // useNavigate hook for routing

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // To show success/error messages
  const [isLoading, setIsLoading] = useState(false); // Show loading state while submitting
  const navigate = useNavigate(); // useNavigate hook for redirecting

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://localhost:8000/api/login/admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      setIsLoading(false); // Reset loading state

      if (!response.ok) {
        // If response is not ok, show error
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      const data = await response.json(); // Get JSON data

      // Save access token and refresh token in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      // Optionally save admin status if it's returned in the API response
      localStorage.setItem('is_admin', JSON.stringify(true)); // assuming the user is admin for this login case

      setMessage(`Login successful! Access Token: ${data.access_token}`);
      console.log('Access Token:', data.access_token);

      // Redirect based on user role (admin or not)
      navigate('/admin-dashboard'); // Admins are redirected to the admin dashboard

    } catch (error) {
      setIsLoading(false); // Reset loading state
      setMessage(`Error: ${error.message}`); // Display error message
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center">Login</h2>

        {/* Display messages */}
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isLoading} // Disable the button during loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
