import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = 'An unexpected error occurred';

        if (error.response) {
            // Server responded with an error status
            console.error('API Error Intercepted:', error.response.status, error.response.data);
            message = error.response.data?.msg || error.response.data?.message || message;
        } else if (error.request) {
            // Request was made but no response was received (e.g. Connection Refused)
            console.error('No Response from Server:', error.message);
            message = 'Server is unreachable. Please ensure the backend is running.';
        } else {
            // Something happened in setting up the request
            console.error('Request Setup Error:', error.message);
            message = error.message;
        }

        // Use global window.showToast if available, otherwise fallback to custom event
        if (window.showToast) {
            window.showToast(message, 'error');
        } else {
            const event = new CustomEvent('SHOW_TOAST', { detail: { message, type: 'error' } });
            window.dispatchEvent(event);
        }

        return Promise.reject(error);
    }
);

export default api;
