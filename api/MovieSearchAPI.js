import apiClient from './client';

export const movieSearchAPI = async movieName => {
  try {
    const { data } = await apiClient.get(`/searchMovies/${movieName}`);
    return data;
  } catch (error) {
    console.error('Error fetching the movie search API', error);
    throw error;
  }
};