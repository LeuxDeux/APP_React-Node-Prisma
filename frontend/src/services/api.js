import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASEURL || 'http://localhost:5000/api/';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    response => response,
    error => {  
        if (error.response) {
            console.error('API Error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            console.error('No response received from API:', error.request);
            return Promise.reject({ error: 'No response from server' });
        } else {
            console.error('API Request Error:', error.message);
            return Promise.reject({ error: error.message });
        }
    }
);

export default api;