import axios from 'axios';
import {BASE_URL} from "../../config/env";

console.log("BASE_URL",BASE_URL)

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginAPI = (data) => API.post('/api/auth/login', data);
export const registerAPI = (data) => API.post('/api/auth/register', data);
export const verifyOtp = (data) => API.post('/api/auth/verify-otp', data)