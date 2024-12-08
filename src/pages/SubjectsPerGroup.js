import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SubjectsPerGroup.css';

const SubjectsPerGroup = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState('');
  const [subjectsData, setSubjectsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('You are not authorized to view this data. Please log in.');
      }

      const response = await fetch(`http://localhost:8000/api/dashboard/subjects_per_group?year=${year}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects data. Status: ${response.status}`);
      }

      const data = await response.json();
      setSubjectsData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleYearSubmit = (e) => {
    e.preventDefault();
    if (year) {
      fetchSubjects();
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchSubjects();
  };

  // Function to navigate to the AdminDashboard page with parameters
  const handleRowClick = (subjectId, groupNumber) => {
    navigate(`/admin/dashboard/lessons/${subjectId}/?group_number=${groupNumber}`);
  };
// http://localhost:3000/admin/dashboard/lessons/1?group_number=101
  return (
    <div className="subjects-per-group">
      <Navbar />
      <h2>Subjects Per Group</h2>

      <form onSubmit={handleYearSubmit} className="year-form">
        <label htmlFor="year">Enter Year:</label>
        <input
          type="text"
          id="year"
          value={year}
          onChange={handleYearChange}
          placeholder="1,2...6"
        />
        <button type="submit">Submit</button>
      </form>

      {loading && <div className="loading-message">Loading...</div>}

      {error && (
        <div className="error-container">
          <div className="error-message">
            <h3>Error: {error}</h3>
            <p>There was an issue fetching the data. Please try again later.</p>
            <button onClick={handleRetry} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && subjectsData.length > 0 && (
        <div>
          <h3>Subjects for Year {year}</h3>
          <table>
            <thead>
              <tr>
                <th>Subject Title</th>
                <th>Professor</th>
                <th>Type</th>
                <th>Group Number</th>
                <th>Year</th>
                <th>Faculty</th>
                <th>Total Lessons</th>
                <th>Remaining Lessons</th>
              </tr>
            </thead>
            <tbody>
              {subjectsData.map((subject) => (
                <tr key={subject.id} onClick={() => handleRowClick(subject.id, subject.group_number)}>
                  <td>{subject.subject_title}</td>
                  <td>{subject.professor}</td>
                  <td>{subject.type}</td>
                  <td>{subject.group_number}</td>
                  <td>{subject.year}</td>
                  <td>{subject.faculty}</td>
                  <td>{subject.total_lessons_number}</td>
                  <td>{subject.remaining_lessons_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectsPerGroup;
