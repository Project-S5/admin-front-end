import jwt_decode from 'jwt-decode';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token'); // Get the refresh token from storage

  if (!refreshToken) {
    console.error('No refresh token found');
    return null;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/login/refresh-token/?refresh_token=${refreshToken}`, {
      method: 'GET', // Assuming the refresh token API uses GET method
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    // Save the new access token to localStorage
    localStorage.setItem('access_token', data.access_token);
    return data.access_token; // Return the refreshed token
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    return null;
  }
};
