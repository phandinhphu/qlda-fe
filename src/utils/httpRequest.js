import axios from 'axios';
import { API_URL } from './constants';

const QLDARequest = axios.create({
    baseURL: API_URL ? `${API_URL}/api` : 'http://localhost:5000/api',
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    withCredentials: true,
});

// Request interceptor: Add Authorization header if token exists in cookie
QLDARequest.interceptors.request.use(
    (config) => {
        // Get token from cookies if available
        const token = getCookie('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Helper function to get cookie value
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Response interceptor: Handle errors globally
QLDARequest.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error for debugging
        if (error.response) {
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
            });
        } else if (error.request) {
            console.error('API Error Request:', error.request);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    },
);

export const get = async (url, params = {}) => {
    const response = await QLDARequest.get(url, params);
    return response;
};

export const post = async (url, data = {}) => {
    const response = await QLDARequest.post(url, data);
    return response;
};

export const put = async (url, data = {}) => {
    const response = await QLDARequest.put(url, data);
    return response;
};

export const patch = async (url, data = {}) => {
    const response = await QLDARequest.patch(url, data);
    return response;
};

export const del = async (url) => {
    const response = await QLDARequest.delete(url);
    return response;
};

export default QLDARequest;
