import React, { useReducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import './LessonDetails.css';

// Define initial state and reducer function
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
      return { ...state, isLoading: false, students: action.payload, error: '' }; // Updated to directly set students as the array
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unsupported action type');
  }
};

const LessonDetails = () => {
  const { lessonId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedStudent, setSelectedStudent] = useState(null);

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
        dispatch({ type: 'FETCH_SUCCESS', payload: data }); // Directly using data as payload
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
    doc.text('Students for Lesson ' + lessonId, 20, 20);

    // Add lesson date_time to the PDF (you can replace this with the actual lesson date if available)
    const lessonDate = new Date();  // Replace with actual lesson datetime if available
    const formattedDate = lessonDate.toLocaleString();
    doc.text('Lesson Date and Time: ' + formattedDate, 20, 30);
    
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

    doc.save('lesson_students.pdf');
  };

  return (
    <div className="lesson-details">
      <Navbar />
      <h1>Students for Lesson {lessonId}</h1>
      {isLoading && <p>Loading students...</p>}
      {error && <p className="error">{error}</p>}

      <button className="btn btn-primary" onClick={handleExportPdf}>
        Export to PDF
      </button>

      <div id="students-container">
        {!isLoading && students.length === 0 ? (
          <p>No students found for this lesson.</p>
        ) : (
          // Ensure students is defined before rendering
          students && students.length > 0 ? (
            students.map((student) => (
              <div
                className="student-item"
                key={student.id}
                onClick={() => handleStudentClick(student)}
              >
                <p>{student.first_name} {student.last_name} - Status: {student.status}</p>
              </div>
            ))
          ) : (
            <p>No students found for this lesson.</p>
          )
        )}
      </div>

      {selectedStudent && (
        <div className="student-details">
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
