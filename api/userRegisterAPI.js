import apiClient from './client';

export const userRegisterAPI = async (
  firstName,
  lastName,
  age,
  gender,
  email,
  username,
  password,
) => {
  try {
    const { data } = await apiClient.post('/register', {
      firstName,
      lastName,
      age,
      gender,
      email,
      username,
      password,
    });
    return data;
  } catch (error) {
    console.error('Error fetching the userRegister API', error);
    throw error;
  }
};