import * as httpRequest from '../utils/httpRequest';

export const getAllProjects = async () => {
    try {
        const response = await httpRequest.get('/projects');
        return response.data;
    } catch (error) {
        console.error('Error in getAllProjects:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi lấy danh sách dự án');
        }
    }
};

export const getProjectById = async (id) => {
    try {
        const response = await httpRequest.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in getProjectById:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi lấy chi tiết dự án');
        }
    }
};

export const createProject = async (data) => {
    try {
        const response = await httpRequest.post('/projects', data);
        return response.data;
    } catch (error) {
        console.error('Error in createProject:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi tạo dự án');
        }
    }
};

export const updateProject = async (id, data) => {
    try {
        const response = await httpRequest.put(`/projects/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error in updateProject:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi cập nhật dự án');
        }
    }
};

export const deleteProject = async (id) => {
    try {
        const response = await httpRequest.del(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteProject:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi xóa dự án');
        }
    }
};
