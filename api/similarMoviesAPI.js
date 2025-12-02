import apiClient from './client';

export const similarMoviesAPI = async movieID => {
  try {
    const { data } = await apiClient.get(`/getSimilarMovies/${movieID}`);
    return data;
  } catch (error) {
    console.error('Error fetching similar movies', error);
    throw error;
  }
};