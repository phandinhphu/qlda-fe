import * as httpRequest from '../utils/httpRequest';

export const getListsByProject = async (projectId) => {
    try {
        const response = await httpRequest.get(`/lists/${projectId}`);
        return response.data; // Trả về mảng các list đã được populate task
    } catch (error) {
        console.error('Error in getListsByProject:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tải dữ liệu project.');
        }
    }
};

export const createList = async (projectId, title) => {
    try {
        const response = await httpRequest.post(`/lists/${projectId}`, { title });
        return response.data; // Trả về list vừa được tạo
    } catch (error) {
        console.error('Error in createList:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể tạo danh sách mới.');
        }
    }
};

export const updateList = async (listId, updates) => {
    try {
        const response = await httpRequest.put(`/lists/${listId}`, updates);
        return response.data; // Trả về list đã được cập nhật
    } catch (error) {
        console.error('Error in updateList:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể cập nhật danh sách.');
        }
    }
};

export const deleteList = async (listId) => {
    try {
        // Giả sử httpRequest của bạn có hàm .delete()
        const response = await httpRequest.del(`/lists/${listId}`);
        return response.data; // Trả về { message, _id }
    } catch (error) {
        console.error('Error in deleteList:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Không thể xóa danh sách.');
        }
    }
};
