import apiClient from './client';

export const userloginAPI = async (username, password) => {
  try {
    const { data } = await apiClient.post('/login', {
      username,
      password,
    });
    return data;
  } catch (error) {
    console.error('Error fetching the login API', error);
    throw error;
  }
};

export const checkAuthAPI = async () => {
  try {
    const { data } = await apiClient.get('/check-auth');
    return data;
  } catch (error) {
    console.error('Error fetching the check-auth API', error);
    throw error;
  }
};

export const userLogout = async () => {
  try {
    const { data } = await apiClient.get('/logout');
    return data;
  } catch (error) {
    console.error('Error fetching the logout API', error);
    throw error;
  }
};