import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userLogoutAPI = async () => {
  try {
    const { data } = await apiClient.get('/logout');
    await AsyncStorage.removeItem('user');
    return data;
  } catch (error) {
    console.error('Error fetching the logout API:', error);
    throw error;
  }
};