import * as httpRequest from '../utils/httpRequest';

/**
 * Lấy danh sách thành viên của 1 project
 * @param {string} projectId
 * @returns {Promise<Array>} Mảng các thành viên
 */
export const getMembersByProject = async (projectId) => {
    try {
        const response = await httpRequest.get(`project_member/${projectId}/members`);
        // backend trả trực tiếp mảng, nên response.data chính là danh sách
        return response.data;
    } catch (error) {
        console.error('Error in getMembersByProject:', error);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách thành viên.');
    }
};

export const searchUsers = async (searchText) => {
    try {
        const response = await httpRequest.get(`project_member/${searchText}`);
        return response.data;
    } catch (error) {
        console.error('Error in searchUsers:', error);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách users.');
    }
};

export const addMember = async (projectId, userId) => {
    try {
        const response = await httpRequest.post(`project_member/${projectId}/members/${userId}`);
        return response.data.message;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Không thể thêm user vào project.');
    }
};
