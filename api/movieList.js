import apiClient from './client';

export const moviesListAPI = async genreID => {
  try {
    const endpoint = genreID ? `/getMovies/${genreID}` : '/getMovies';
    const { data } = await apiClient.get(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching the movie list API', error);
    throw error;
  }
};
