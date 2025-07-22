// src/axios.jsx
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3030',
  withCredentials: true, // 🔐 crucial for sending the session cookie
});

export default instance;