import * as httpRequest from '../utils/httpRequest';

export const getListTasks = async (listId) => {
    try {
        const response = await httpRequest.get(`/lists/${listId}/tasks`);
        return response.data;
    } catch (error) {
        console.error('Error in getListTasks:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi lấy danh sách tasks');
        }
    }
};

export const createTask = async (listId, data) => {
    try {
        const response = await httpRequest.post(`/lists/${listId}/tasks`, data);
        return response.data;
    } catch (error) {
        console.error('Error in createTask:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi tạo task');
        }
    }
};

export const updateTask = async (taskId, data) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error in updateTask:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi cập nhật task');
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

export const toggleTaskComplete = async (taskId) => {
    try {
        const response = await httpRequest.patch(`/tasks/${taskId}/toggle-complete`);
        return response.data;
    } catch (error) {
        console.error('Error in toggleTaskComplete:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi cập nhật trạng thái task');
        }
    }
};

export const reorderTasks = async (listId, taskOrders) => {
    try {
        const response = await httpRequest.put(`/lists/${listId}/tasks/reorder`, {
            taskOrders,
        });
        return response.data;
    } catch (error) {
        console.error('Error in reorderTasks:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi sắp xếp tasks');
        }
    }
};

export const moveTask = async (taskId, targetListId, position) => {
    try {
        const response = await httpRequest.put(`/tasks/${taskId}/move`, {
            targetListId,
            position,
        });
        return response.data;
    } catch (error) {
        console.error('Error in moveTask:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi di chuyển task');
        }
    }
};
