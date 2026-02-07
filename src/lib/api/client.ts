import axios from 'axios';

export const API_PREFIX = '/api/v2';
const SERVER_HOST = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000';

const axiosInstance = axios.create({
  baseURL: `${SERVER_HOST}${API_PREFIX}`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshUrl = originalRequest.url?.includes('/auth/refresh');

    const isAuthUrl =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/user/password');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshUrl && !isAuthUrl) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh');
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('리프레시 에러', refreshError);
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
