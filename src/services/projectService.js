import * as httpRequest from '../utils/httpRequest';

/**
 * @desc Lấy danh sách các dự án mà user đã tạo
 * @param {string} userId ID của người dùng (lấy từ useAuth().user._id)
 */
export const getProjectsByUser = async (userId) => {
    try {
        // Gọi API backend mới tạo
        const response = await httpRequest.get('projects/user/' + userId);
        return response.data; // Trả về mảng các dự án
    } catch (error) {
        console.error('Error in getProjectsByUser:', error);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách dự án.');
    }
};
