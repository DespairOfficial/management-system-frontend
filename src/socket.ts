import { io } from 'socket.io-client';
import { HOST_API_KEY } from './config-global';

// "undefined" means the URL will be computed from the `window.location` object
const URL = HOST_API_KEY;

const token = localStorage.getItem('accessToken');

export const socket = io(URL, {
  extraHeaders: {
    authorization: `Bearer ${token}`,
  },
});
