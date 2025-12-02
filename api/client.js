import axios from 'axios';
import { ip } from './ip';

const apiClient = axios.create({
  baseURL: ip,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiClient;

