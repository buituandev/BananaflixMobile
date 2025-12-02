import apiClient from './client';

export const updateProfileAPI = async (firstName, lastName, age, gender, email) => {
  try {
    const { data } = await apiClient.put(
      '/profile',
      { firstName, lastName, age, gender, email },
    //   token
    //     ? { headers: { Authorization: `Bearer ${token}` } }
    //     : undefined
    );
    return data;
  } catch (error) {
    console.error('Error updating profile', error);
    throw error;
  }
};
