import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar component
import './SubjectsPerGroup.css'; // Import the CSS for styling

const SubjectsPerGroup = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [year, setYear] = useState(''); // State to hold the year input
  const [subjectsData, setSubjectsData] = useState([]); // Store subjects data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch subjects data from API
  const fetchSubjects = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    try {
      const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage or cookies

      console.log('Token:', token); // Log token for debugging

      if (!token) {
        throw new Error('You are not authorized to view this data. Please log in.');
      }

      const response = await fetch(`http://localhost:8000/api/dashboard/subjects_per_group?year=${year}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subjects data. Status: ${response.status}`);
      }

      const data = await response.json();
      setSubjectsData(data); // Update state with fetched data
    } catch (error) {
      setError(error.message); // Update error state if there's an error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle year input change
  const handleYearChange = (e) => {
    setYear(e.target.value); // Update year state with the user's input
  };

  // Handle form submission to fetch data
  const handleYearSubmit = (e) => {
    e.preventDefault();
    if (year) {
      fetchSubjects(); // Call fetchSubjects to get the data based on the selected year
    }
  };

  // Handle retry when an error occurs
  const handleRetry = () => {
    setError(null); // Clear the error
    setLoading(true); // Set loading state to true to trigger refetch
    fetchSubjects(); // Retry fetching the data
  };

  return (
    <div className="subjects-per-group">
      <Navbar />
      <h2>Subjects Per Group</h2>

      {/* Input Field to Enter Year */}
      <form onSubmit={handleYearSubmit} className="year-form">
        <label htmlFor="year">Enter Year:</label>
        <input
          type="text"
          id="year"
          value={year}
          onChange={handleYearChange}
          placeholder="Enter year (e.g., 1-6)"
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
                <th>Subject</th>
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
                <tr key={subject.id}>
                  <td>{subject.subject}</td>
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
