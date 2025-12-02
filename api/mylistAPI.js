import apiClient from './client';

export const addMovieToList = async movieID => {
  try {
    const { data } = await apiClient.post(`/add-to-mylist/${movieID}`);
    return data;
  } catch (error) {
    console.error('Error adding movie to list', error);
    throw error;
  }
};

export const removeMovieFromList = async movieID => {
  try {
    const { data } = await apiClient.post(`/remove-from-mylist/${movieID}`);
    return data;
  } catch (error) {
    console.error('Error removing movie from list', error);
    throw error;
  }
};

export const mylistAPI = async () => {
  try {
    const { data } = await apiClient.get('/mylist');
    return data;
  } catch (error) {
    console.error('Error fetching my list', error);
    throw error;
  }
};

export const mylistID = async () => {
  try {
    const { data } = await apiClient.get('/mylistid');
    return data;
  } catch (error) {
    console.error('Error fetching my list IDs', error);
    throw error;
  }
};

export const checkIfMovieInList = async movieID => {
  try {
    const { data } = await apiClient.get(`/check-in-mylist/${movieID}`);
    return data;
  } catch (error) {
    console.error('Error checking if movie is in list', error);
    throw error;
  }
};
