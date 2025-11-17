import * as httpRequest from '../utils/httpRequest';

export const getUserStats = async () => {
    try {
        const response = await httpRequest.get('/users/me/stats');
        return response.data; // Trả về { totalTasks, todoTasks, percentage }
    } catch (error) {
        console.error('Error in getUserStats:', error);
        throw new Error(error.response?.data?.message || 'Không thể tải thống kê.');
    }
};
