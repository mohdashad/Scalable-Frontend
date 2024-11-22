import axios from 'axios';

const userApi = axios.create({
  baseURL: 'http://localhost:5000/api/users', // userApi base URL
});

// Access token storage (can also use localStorage)
let accessToken =localStorage.getItem('token');

// Request Interceptor
userApi.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {      
        window.location.href = '/login';
      }
    } 
 );

export default userApi;
