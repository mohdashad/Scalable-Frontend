import axios from 'axios';

const bookApi = axios.create({
  baseURL: 'http://localhost:4000/api/books', // bookApi base URL
});

// Access token storage (can also use localStorage)
let accessToken = null;

// Request Interceptor
bookApi.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
bookApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Access token might have expired
      try {
        
        const refreshResponse = await axios.post('http://localhost:4000/api/books/auth/', {"clientId":"1234567890abcdefg.book.service.com"});
        accessToken = refreshResponse.data.token;
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return bookApi.request(error.config); // Retry original request
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        // Redirect to login or show error
        //window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default bookApi;
