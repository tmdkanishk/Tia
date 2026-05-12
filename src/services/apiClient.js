// services/apiClient.js

import axios from 'axios';
import { store } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';
import {BASE_URL} from "../config/env";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    // If token expired and not retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${BASE_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // update Redux
        store.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            refreshToken,
            role: state.auth.role,
          })
        );

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;