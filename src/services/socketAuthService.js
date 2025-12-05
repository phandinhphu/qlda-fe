import * as httpRequest from '../utils/httpRequest';

// Lấy token cho socket connection
export const getSocketToken = async () => {
    try {
        // Thử lấy từ localStorage trước (nếu đã lưu khi login)
        const localToken = localStorage.getItem('socket_token');
        if (localToken) {
            return localToken;
        }

        // Nếu không có, gọi API để lấy token mới
        // Backend cần tạo endpoint này: GET /auth/socket-token
        const response = await httpRequest.get('/auth/socket-token');

        if (response.data.token) {
            localStorage.setItem('socket_token', response.data.token);
            return response.data.token;
        }

        return null;
    } catch (error) {
        console.error('Error getting socket token:', error);
        // Nếu API không tồn tại, thử lấy từ localStorage
        return localStorage.getItem('socket_token');
    }
};
