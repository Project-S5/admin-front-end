import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [subjectPerGroupId, setSubjectPerGroupId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLessons = async (subjectPerGroupId, groupNumber) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Access token is missing. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      const url = `http://localhost:8000/api/dashboard/lessons?subject_per_group_id=${subjectPerGroupId}&group_number=${groupNumber}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch lessons');
      }

      const data = await response.json();
      setLessons(data);
      setError('');
    } catch (error) {
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
      <Navbar />
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
              <h3>{lesson.subject_name}</h3> {/* Swapped position */}
              <p><strong>Lesson ID:</strong> {lesson.id}</p> {/* Moved Lesson ID here */}
              <p><strong>Group Number:</strong> {lesson.group_number}</p>
              <p><strong>Professor:</strong> {lesson.professor_full_name}</p>
              <p><strong>Status:</strong> {lesson.status}</p>
              <p><strong>Date and Time:</strong> {new Date(lesson.date_time).toLocaleString()}</p>
              <button onClick={() => navigate(`/lesson/${lesson.id}/students`)}>
                View Students
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
