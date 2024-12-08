import React, { useReducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import './LessonDetails.css';
import { useLocation } from 'react-router-dom';

const initialState = {
  students: [],
  lesson: {},
  isLoading: false,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, students: action.payload, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unsupported action type');
  }
};

const LessonDetails = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Destructure the state received from the previous page
  const { subjectTitle, groupNumber, lessonDateTime } = location.state || {};

  useEffect(() => {
    const fetchLessonAndStudents = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          alert('Access token is missing. Redirecting to login.');
          window.location.href = '/login';
          return;
        }

        const url = `http://localhost:8000/api/dashboard/lessons/${lessonId}/students`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch students');
        }

        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILURE', payload: error.message });
      }
    };

    fetchLessonAndStudents();
  }, [lessonId]);

  const { students, isLoading, error } = state;

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Students for ${subjectTitle} (Group ${groupNumber})`, 20, 20);

    const formattedDate = new Date(lessonDateTime).toLocaleString();
    doc.text(`Lesson Date and Time: ${formattedDate}`, 20, 30);

    let yOffset = 40;
    students.forEach((student, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. ${student.first_name} ${student.last_name} - Status: ${student.status}`,
        20,
        yOffset
      );
      yOffset += 10;
    });

    doc.save(`${subjectTitle}_Group ${groupNumber}_${formattedDate}_student_list.pdf`);
  };

  return (
    <div className="lesson-details">
      <Navbar />
      <div className="lesson-header">
        <h1>{subjectTitle} (Group {groupNumber}) <br /> {new Date(lessonDateTime).toLocaleString()}</h1>
      </div>

      {isLoading && <div className="loading">Loading students...</div>}
      {error && <div className="error">{error}</div>}

      <button className="btn btn-primary" onClick={handleExportPdf}>
        Export to PDF
      </button>

      <div id="students-container">
        {!isLoading && students.length === 0 ? (
          <p>No students found for this lesson.</p>
        ) : (
          students && students.length > 0 && (
            <div className="students-list">
              {students.map((student) => (
                <div
                  className="student-item"
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                >
                  <p>{student.first_name} {student.last_name} - Status: {student.status}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {selectedStudent && (
        <div className="student-details">
          <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {selectedStudent.first_name} {selectedStudent.last_name}</p>
          <p><strong>Email:</strong> {selectedStudent.email}</p>
          <p><strong>ID:</strong> {selectedStudent.id}</p>
          <p><strong>Year:</strong> {selectedStudent.year}</p>
          <p><strong>Group:</strong> {selectedStudent.group_number}</p>
          <p><strong>Degree:</strong> {selectedStudent.degree}</p>
          <p><strong>Faculty:</strong> {selectedStudent.faculty}</p>
        </div>
      )}
    </div>
  );
};

export default LessonDetails;
