import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { refreshAccessToken } from './utils'; // Helper function for refreshing token
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      let accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        setLoading(false);
        return setIsAuthenticated(false); // No access token means not authenticated
      }

      // Check if the token has expired
      const tokenData = jwtDecode(accessToken); // Decode the token to check expiration
      const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        console.log('Token expired, refreshing...');
        accessToken = await refreshAccessToken(); // Refresh token if expired

        if (!accessToken) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(true); // Token is valid
      }

      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children; // If authenticated, render protected content
};

export default ProtectedRoute;
