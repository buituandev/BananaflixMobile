import apiClient from './client';

export const updateWatchedMovie = async (movieID, watchedTime = 0) => {
  try {
    const { data } = await apiClient.post(`/update-watched-time/${movieID}`, {
      watchedTime,
    });
    return data;
  } catch (error) {
    console.error('Error updating watched movie', error);
    throw error;
  }
};

export const getWatchedMovies = async () => {
  try {
    const { data } = await apiClient.get('/watched-movies');
    return data;
  } catch (error) {
    console.error('Error fetching watched movies', error);
    throw error;
  }
};

export const getWatchtime = async movieID => {
  try {
    const { data } = await apiClient.get(`/watched-time/${movieID}`);
    return data;
  } catch (error) {
    console.error('Error fetching watchtime', error);
    throw error;
  }
};

export const removeWatchedMovie = async movieID => {
  try {
    const { data } = await apiClient.post(`/remove-watched-movie/${movieID}`, {
      movieID,
    });
    return data;
  } catch (error) {
    console.error('Error removing watched movie', error);
    throw error;
  }
};

export const isWatchedMvs = async movieID => {
  try {
    const { data } = await apiClient.get(`/is-in-watched-list/${movieID}`);
    return data;
  } catch (error) {
    console.error('Error checking if movie is watched', error);
    throw error;
  }
};