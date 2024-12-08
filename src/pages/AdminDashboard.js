import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [subjectPerGroupId, setSubjectPerGroupId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectPerGroupId || !groupNumber) {
      alert('Please fill in all fields.');
      return;
    }

    // Navigate to the Lessons page with the subjectPerGroupId and groupNumber as URL params
    navigate(`/admin/dashboard/lessons/${subjectPerGroupId}?group_number=${groupNumber}`);
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <h1>Admin Dashboard</h1>
      <form className="admin-dashboard-form" onSubmit={handleSubmit}>
        <div className="admin-dashboard-form-group">
          <label htmlFor="subjectPerGroupId">Subject Per Group ID:</label>
          <input
            type="number"
            id="subjectPerGroupId"
            value={subjectPerGroupId}
            onChange={(e) => setSubjectPerGroupId(e.target.value)}
            required
          />
        </div>
        <div className="admin-dashboard-form-group">
          <label htmlFor="groupNumber">Group Number:</label>
          <input
            type="number"
            id="groupNumber"
            value={groupNumber}
            onChange={(e) => setGroupNumber(e.target.value)}
            required
          />
        </div>
        <button className="admin-dashboard-button" type="submit">
          View Lessons
        </button>
      </form>
      {error && <p className="admin-dashboard-error">{error}</p>}
    </div>
  );
};

export default AdminDashboard;
