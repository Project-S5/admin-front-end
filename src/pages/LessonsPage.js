import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LessonsPage.css';

const LessonsPage = () => {
  const { subjectPerGroupId } = useParams();
  const location = useLocation();
  const [lessons, setLessons] = useState([]);
  const [subjectTitle, setSubjectTitle] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLessons = async () => {
    try {
      const groupNumberFromURL = new URLSearchParams(location.search).get('group_number');
      setGroupNumber(groupNumberFromURL);
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Access token is missing. Redirecting to login.');
        window.location.href = '/login';
        return;
      }

      const url = `http://localhost:8000/api/dashboard/lessons?subject_per_group_id=${subjectPerGroupId}&group_number=${groupNumberFromURL}`;
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
      setSubjectTitle(data[0]?.subject_name || 'No subject title available');
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewStudents = (lessonId, subjectTitle, lessonDateTime) => {
    navigate(`/lesson/${lessonId}/students`, {
      state: { subjectTitle, groupNumber, lessonDateTime }
    });
  };

  useEffect(() => {
    fetchLessons();
  }, [subjectPerGroupId, location.search]);

  return (
    <div className="lessons-page">
      <Navbar />
      <div className="page-header">
        <h1>{subjectTitle} for Group {groupNumber}</h1>
      </div>
      {error && <p className="lessons-page-error">{error}</p>}
      <div className="lessons-list">
        {lessons.length === 0 ? (
          <p>No lessons found for this group.</p>
        ) : (
          lessons.map((lesson) => (
            <div className="lesson-card" key={lesson.id}>
              <h3 className="lesson-title">{lesson.subject_name}</h3>
              <p><strong>Lesson ID:</strong> {lesson.id}</p>
              <p><strong>Professor:</strong> {lesson.professor_full_name}</p>
              <p><strong>Status:</strong> {lesson.status}</p>
              <p><strong>Date and Time:</strong> {new Date(lesson.date_time).toLocaleString()}</p>
              <button 
                className="view-students-button" 
                onClick={() => handleViewStudents(lesson.id, lesson.subject_name, lesson.date_time)}>
                View Students
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonsPage;
