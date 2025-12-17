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

export const getStepByTaskId = async (taskId) => {
    try {
        const response = await httpRequest.get(`/tasks/${taskId}/steps`);
        return response.data;
    } catch (error) {
        console.error('Error in getStepByTaskId:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tải các bước.');
        }
    }
};

export const toggleStep = async (stepId, taskId) => {
    try {
        const response = await httpRequest.patch(`/tasks/${taskId}/steps/${stepId}/toggle-completed`);
        return response.data; // Trả về step đã cập nhật
    } catch (error) {
        console.error('Error in updateStep:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể cập nhật bước.');
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

export const getTaskLabels = async (taskId) => {
    try {
        const response = await httpRequest.get(`/tasks/${taskId}/labels`);
        return response.data.data; // Trả về danh sách labels
    } catch (error) {
        console.error('Error in getTaskLabels:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tải danh sách nhãn.');
        }
    }
};

export const updateLabel = async (taskId, labelId, labelData) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}/labels/${labelId}`, labelData);
        return response.data.data; // Trả về label đã cập nhật
    } catch (error) {
        console.error('Error in updateLabel:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể cập nhật nhãn.');
        }
    }
};

export const deleteLabel = async (taskId, labelId) => {
    try {
        const response = await httpRequest.del(`/tasks/${taskId}/labels/${labelId}`);
        return response.data; // Trả về kết quả xóa
    } catch (error) {
        console.error('Error in deleteLabel:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể xóa nhãn.');
        }
    }
};

export const getTaskMembers = async (taskId) => {
    try {
        const response = await httpRequest.get(`/tasks/${taskId}/members`);
        return response.data.data; // Trả về danh sách thành viên
    } catch (error) {
        console.error('Error in getTaskMembers:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tải danh sách thành viên.');
        }
    }
};

export const addTaskMember = async (taskId, userId) => {
    try {
        const response = await httpRequest.post(`/tasks/${taskId}/members`, { userId });
        return response.data.data; // Trả về thành viên vừa thêm
    } catch (error) {
        console.error('Error in addTaskMember:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể gán thành viên.');
        }
    }
};

export const removeTaskMember = async (taskId, userId) => {
    try {
        const response = await httpRequest.del(`/tasks/${taskId}/members/${userId}`);
        return response.data; // Trả về kết quả xóa
    } catch (error) {
        console.error('Error in removeTaskMember:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể xóa thành viên.');
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

export const getComments = async (taskId) => {
    try {
        const response = await httpRequest.get(`/tasks/${taskId}/comments`);
        return response.data.data; // Trả về danh sách comments
    } catch (error) {
        console.error('Error in getComments:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tải danh sách bình luận.');
        }
    }
};

export const updateComment = async (taskId, commentId, commentData) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}/comments/${commentId}`, commentData);
        return response.data.data; // Trả về comment đã cập nhật
    } catch (error) {
        console.error('Error in updateComment:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể cập nhật bình luận.');
        }
    }
};

export const deleteComment = async (taskId, commentId) => {
    try {
        const response = await httpRequest.del(`/tasks/${taskId}/comments/${commentId}`);
        return response.data; // Trả về kết quả xóa
    } catch (error) {
        console.error('Error in deleteComment:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể xóa bình luận.');
        }
    }
};

export const uploadTaskFile = async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await httpRequest.post(`/tasks/${taskId}/uploads`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('lỗi ở taskService - uploadFile', error);
    }
};

export const getTaskFiles = async (taskId) => {
    try {
        const respone = await httpRequest.get(`/tasks/${taskId}/files`);
        return respone.data;
    } catch (error) {
        console.error('Lỗi getTaskFiles ở service', error);
        return [];
    }
};
