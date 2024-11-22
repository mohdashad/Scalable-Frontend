import axios from 'axios';

const requestApi = axios.create({
  baseURL: 'http://localhost:7000/api/request', // requestApi base URL
});

// Access token storage (can also use localStorage)
let accessToken = null;

// Request Interceptor
requestApi.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
requestApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Access token might have expired
      try {
        const body=JSON.stringify({"clientId":"1234567890abcdefg.request.service.com"});
        const refreshResponse = await axios.post('http://localhost:7000/api/request/auth/', {"clientId":"1234567890abcdefg.request.service.com"});
        accessToken = refreshResponse.data.token;
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return requestApi.request(error.config); // Retry original request
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Redirect to login or show error
        //window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default requestApi;
