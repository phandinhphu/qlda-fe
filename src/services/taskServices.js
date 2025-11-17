import * as httpRequest from '../utils/httpRequest';

export const getTaskById = async (taskId) => {
    try {
        const response = await httpRequest.get(`/tasks/${taskId}`);
        return response.data;
    } catch (error) {
        console.error('Error in getTaskById:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tải chi tiết công việc.');
        }
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await httpRequest.post('/tasks', taskData);
        return response.data; // Trả về task vừa tạo
    } catch (error) {
        console.error('Error in createTask:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tạo công việc mới.');
        }
    }
};

/**
 * @desc Cập nhật một Task (thẻ)
 * @param {string} taskId ID của Task
 * @param {object} updates Dữ liệu cập nhật, Vd: { title, status, list_id }
 */
export const updateTask = async (taskId, updateData) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}`, updateData);
        return response.data; // Trả về task đã cập nhật
    } catch (error) {
        console.error('Error in updateTask:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể cập nhật công việc.');
        }
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await httpRequest.del(`/tasks/${taskId}`);
        return response.message;
    } catch (error) {
        console.error('Error in deleteTask:', error);
    }
};

export const addStep = async (taskId, stepData) => {
    try {
        const response = await httpRequest.post(`/tasks/${taskId}/steps`, stepData);
        return response.data; // Trả về step vừa tạo
    } catch (error) {
        console.error('Error in addStep:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể thêm bước mới.');
        }
    }
};

export const addLabel = async (taskId, labelData) => {
    try {
        const response = await httpRequest.post(`/tasks/${taskId}/labels`, labelData);
        return response.data; // Trả về label vừa tạo
    } catch (error) {
        console.error('Error in addLabel:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể thêm nhãn mới.');
        }
    }
};

export const addComment = async (taskId, commentData) => {
    try {
        const response = await httpRequest.post(`/tasks/${taskId}/comments`, commentData);
        return response.data; // Trả về comment vừa tạo (đã populate user)
    } catch (error) {
        console.error('Error in addComment:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể gửi bình luận.');
        }
    }
};
