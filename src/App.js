// App.js or Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';  // Import the LoginPage from the correct path
import AdminDashboard from './pages/AdminDashboard';  // Import the AdminDashboard from the correct path
import { Navigate } from 'react-router-dom'; // Import Navigate
import LessonDetails from './pages/LessonDetails';
import RegisterProfessor from './pages/RegisterProfessor';
import SubjectsPerGroup from './pages/SubjectsPerGroup'; 
import LessonsPage from './pages/LessonsPage';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin-dashboard"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route path="/lesson/:lessonId/students" element={isAuthenticated ? <LessonDetails />: <Navigate to="/" />} />
        <Route path="/register-professor" element={isAuthenticated ? <RegisterProfessor />: <Navigate to="/" />} />
        <Route path="/subjects-per-group" element={isAuthenticated ? <SubjectsPerGroup />: <Navigate to="/" />} />
        <Route path="/admin/dashboard/lessons/:subjectPerGroupId" element={isAuthenticated ? <LessonsPage /> : <Navigate to="/" />} />
  
        {/* <Route path="/" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
