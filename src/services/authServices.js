import * as httpRequest from '../utils/httpRequest';

export const login = async (email, password) => {
    try {
        await httpRequest.post('/auth/login', { email, password });
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const register = async (user) => {
    try {
        const response = await httpRequest.post('/auth/register', user);
        return response.data;
    } catch (error) {
        console.error('Error in register:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const logout = async () => {
    try {
        await httpRequest.post('/auth/logout');
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await httpRequest.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    }
};

export const forgotPassword = async (email) => {
    try {
        // Chỉ gửi email, không cần nhận lại gì
        await httpRequest.post('/auth/forgot-password', { email });
    } catch (error) {
        // Vẫn throw lỗi để component biết (nếu cần)
        throw new Error(error.response?.data?.message || 'Lỗi khi gửi email.');
    }
};

export const resetPassword = async (token, password) => {
    try {
        const response = await httpRequest.post(`/auth/reset-password/${token}`, { password });
        return response.data; // Trả về thông báo thành công
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
    }
};
