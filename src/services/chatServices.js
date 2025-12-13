import QLDARequest from '../utils/httpRequest';

// Lấy tất cả phòng chat của user
export const getUserChatRooms = async () => {
    const response = await QLDARequest.get('/chat/rooms/user');
    return response.data;
};

// Lấy phòng chat theo project
export const getProjectChatRooms = async (projectId) => {
    const response = await QLDARequest.get(`/chat/rooms/project/${projectId}`);
    return response.data;
};

// Lấy chi tiết phòng chat
export const getChatRoomDetail = async (roomId) => {
    const response = await QLDARequest.get(`/chat/rooms/${roomId}`);
    return response.data;
};

// Lấy danh sách thành viên phòng chat
export const getChatRoomMembers = async (roomId) => {
    const response = await QLDARequest.get(`/chat/rooms/${roomId}/members`);
    return response.data;
};

// Lấy tin nhắn trong phòng chat
export const getChatMessages = async (roomId, page = 1, limit = 50) => {
    const response = await QLDARequest.get(`/chat/rooms/${roomId}/messages`, {
        params: { page, limit },
    });
    return response.data;
};

// Gửi tin nhắn (HTTP)
export const sendMessage = async (roomId, message) => {
    const response = await QLDARequest.post(`/chat/rooms/${roomId}/messages`, {
        message,
    });
    return response.data;
};

// Tạo hoặc lấy phòng chat trực tiếp
export const createOrGetDirectRoom = async (projectId, targetUserId) => {
    const response = await QLDARequest.post('/chat/rooms/direct', {
        projectId,
        targetUserId,
    });
    return response.data;
};

// Xóa tin nhắn
export const deleteMessage = async (messageId) => {
    const response = await QLDARequest.delete(`/chat/messages/${messageId}`);
    return response.data;
};
