import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const client = axios.create({
    baseURL: `${baseApiUrl.replace(/\/$/, '')}/api/projects`,
    withCredentials: false,
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Đã xảy ra lỗi không xác định.';
        return Promise.reject({ ...error, message });
    },
);

export const projectService = {
    getAll: () => client.get('/'),
    getById: (id) => client.get(`/${id}`),
    create: (data) => client.post('/', data),
    update: (id, data) => client.put(`/${id}`, data),
    delete: (id) => client.delete(`/${id}`),
};

export default projectService;
