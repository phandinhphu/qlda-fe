import axios from 'axios';
import { API_URL } from './constants';

const QLDARequest = axios.create({
    baseURL: API_URL ? `${API_URL}/api` : 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Xử lý lỗi toàn cục
QLDARequest.interceptors.response.use(
    (response) => response,
    (error) => {
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

export const del = async (url) => {
    const response = await QLDARequest.delete(url);
    return response;
};

export default QLDARequest;
