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
      // Access token might have expired
      try {
        //const body=JSON.stringify({"clientId":"1234567890abcdefg.request.service.com"});
        //const refreshResponse = await axios.post('http://localhost:7000/api/transaction/auth/', {"clientId":"1234567890abcdefg.request.service.com"});
        accessToken = localStorage.getItem('token');
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return userApi.request(error.config); // Retry original request
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Redirect to login or show error
        //window.location.href = '/login';
      }
    } 
 );

export default userApi;
