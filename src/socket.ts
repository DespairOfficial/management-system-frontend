import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:5001';

const token = localStorage.getItem('accessToken');
export const socket = io(URL, {
  extraHeaders: {
    authorization: `Bearer ${token}`,
  },
});
