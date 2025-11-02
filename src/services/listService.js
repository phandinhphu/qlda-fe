import * as httpRequest from '../utils/httpRequest';

export const getProjectLists = async (projectId) => {
    try {
        const response = await httpRequest.get(`/projects/${projectId}/lists`);

        // Debug logging
        console.log('getProjectLists - Full response:', response);
        console.log('getProjectLists - response.data:', response.data);

        // Backend returns { success: true, data: ... }
        // httpRequest.get returns axios response: { data: { success: true, data: ... } }
        // So response.data is { success: true, data: ... }
        if (response?.data) {
            if (response.data.success !== undefined && response.data.data !== undefined) {
                // Standard format: { success: true, data: [...] }
                console.log('getProjectLists - Returning data array:', response.data.data);
                return Array.isArray(response.data.data) ? response.data.data : [];
            }
            // If response.data is already an array (unlikely but possible)
            if (Array.isArray(response.data)) {
                console.log('getProjectLists - Response.data is already an array');
                return response.data;
            }
        }

        // Fallback
        console.warn('getProjectLists - Unexpected response structure, returning empty array');
        return [];
    } catch (error) {
        console.error('Error in getProjectLists:', error);
        console.error('Error response:', error.response);
        console.error('Error response data:', error.response?.data);

        if (error.response && error.response.data) {
            const errorMessage =
                error.response.data.message || error.response.data.error || 'Có lỗi xảy ra khi lấy danh sách lists';
            throw new Error(errorMessage);
        } else if (error.message) {
            throw error;
        } else {
            throw new Error('Có lỗi xảy ra khi lấy danh sách lists');
        }
    }
};

export const createList = async (projectId, data) => {
    try {
        const response = await httpRequest.post(`/projects/${projectId}/lists`, data);
        // Backend returns { success: true, data: ... }
        if (response.data && response.data.success && response.data.data) {
            return response.data.data; // Return the created list object
        }
        return response.data?.data || response.data;
    } catch (error) {
        console.error('Error in createList:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi tạo list');
        }
    }
};

export const updateList = async (listId, data) => {
    try {
        const response = await httpRequest.put(`/lists/${listId}`, data);
        // Backend returns { success: true, data: ... }
        if (response.data && response.data.success && response.data.data) {
            return response.data.data; // Return the updated list object
        }
        return response.data?.data || response.data;
    } catch (error) {
        console.error('Error in updateList:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi cập nhật list');
        }
    }
};

export const deleteList = async (listId) => {
    try {
        const response = await httpRequest.del(`/lists/${listId}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteList:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi xóa list');
        }
    }
};

export const reorderLists = async (projectId, listOrders) => {
    try {
        const response = await httpRequest.put(`/projects/${projectId}/lists/reorder`, {
            listOrders,
        });
        // Backend returns { success: true, data: ... } where data is array of lists
        if (response.data && response.data.success && response.data.data) {
            return response.data.data; // Return the array of reordered lists
        }
        return response.data?.data || response.data;
    } catch (error) {
        console.error('Error in reorderLists:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra khi sắp xếp lists');
        }
    }
};
