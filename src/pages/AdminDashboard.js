import React, { useState } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar for logout functionality
import './AdminDashboard.css'; // Import CSS for styling

const AdminDashboard = () => {
  const [subjectPerGroupId, setSubjectPerGroupId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');

  const fetchLessons = async (subjectPerGroupId, groupNumber) => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('access_token');
      console.log('Access token:', token); // Debugging: Log token
      
      if (!token) {
        alert('Access token is missing. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      const url = `http://localhost:8000/api/dashboard/lessons?subject_per_group_id=${subjectPerGroupId}&group_number=${groupNumber}`;
      console.log('API URL:', url); // Debugging: Log API URL
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response); // Debugging: Log response details

      // Check if response is okay
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData); // Debugging: Log error body
        throw new Error(
          `Failed to fetch lessons: ${response.status} ${response.statusText}`
        );
      }

      // Parse and set lessons
      const data = await response.json();
      console.log('Fetched lessons:', data); // Debugging: Log lessons
      setLessons(data);
      setError('');
    } catch (error) {
      console.error('Fetch lessons error:', error.message); // Debugging: Log error message
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectPerGroupId || !groupNumber) {
      alert('Please fill in all fields.');
      return;
    }
    fetchLessons(subjectPerGroupId, groupNumber);
  };

  return (
    <div className="admin-dashboard">
      <Navbar /> {/* Navbar with logout functionality */}
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subjectPerGroupId">Subject Per Group ID:</label>
          <input
            type="number"
            id="subjectPerGroupId"
            value={subjectPerGroupId}
            onChange={(e) => setSubjectPerGroupId(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="groupNumber">Group Number:</label>
          <input
            type="number"
            id="groupNumber"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
            required
          />
        </div>

        <button type="submit">View Lessons</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div id="lessons-container">
        {lessons.length === 0 ? (
          <p>No lessons found for this group.</p>
        ) : (
          lessons.map((lesson) => (
            <div className="lesson" key={lesson.id}>
              <h3>Lesson ID: {lesson.id}</h3>
           
              <p>
                <strong>Group Number:</strong> {lesson.group_number}
              </p>
              <p>
                <strong>Professor ID:</strong> {lesson.professor}
              </p>
              <p>
                <strong>Status:</strong> {lesson.status}
              </p>
              <p>
                <strong>Date and Time:</strong>{' '}
                {new Date(lesson.date_time).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
