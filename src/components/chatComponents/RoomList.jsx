import { useState, useEffect } from 'react';
import { getUserChatRooms } from '../../services/chatServices';
import { useSocket } from '../../hooks/socket';
import { MessageCircle, ArrowLeft, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoomList({ onSelectRoom, selectedRoomId, projectId }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const { socket } = useSocket();

    const loadRooms = async () => {
        try {
            setLoading(true);
            const response = await getUserChatRooms();

            if (response.success) {
                // Lọc theo project nếu có projectId
                const filteredRooms = projectId
                    ? response.data.filter((room) => room.project_id?._id === projectId)
                    : response.data;
                setRooms(filteredRooms);
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data) => {
            const { message } = data;

            setRooms((prevRooms) => {
                // Tìm phòng chat tương ứng
                const roomIndex = prevRooms.findIndex((r) => r._id === message.room_id);

                if (roomIndex === -1) return prevRooms;

                const updatedRooms = [...prevRooms];
                const room = { ...updatedRooms[roomIndex] };

                // Cập nhật tin nhắn cuối cùng
                room.last_message = message;

                // Tăng unread_count nếu không phải phòng đang chọn
                if (message.room_id !== selectedRoomId) {
                    room.unread_count = (room.unread_count || 0) + 1;
                }

                // Xóa phòng khỏi vị trí cũ
                updatedRooms.splice(roomIndex, 1);

                // Thêm phòng lên đầu danh sách
                updatedRooms.unshift(room);

                return updatedRooms;
            });
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, selectedRoomId]);

    const getRoomName = (room) => {
        if (room.type === 'direct' && room.other_member) {
            return room.other_member.name;
        }
        return room.name;
    };

    const getLastMessage = (room) => {
        if (!room.last_message) return 'Chưa có tin nhắn';
        const msg = room.last_message.message;
        return msg.length > 50 ? msg.substring(0, 50) + '...' : msg;
    };

    const getLastMessageTime = (room) => {
        if (!room.last_message) return '';
        const date = new Date(room.last_message.created_at);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút`;
        if (diffHours < 24) return `${diffHours} giờ`;
        if (diffDays < 7) return `${diffDays} ngày`;
        return date.toLocaleDateString('vi-VN');
    };

    const filteredRooms = rooms.filter((room) => getRoomName(room).toLowerCase().includes(searchQuery.toLowerCase()));

    const handleSelectRoom = (room) => {
        // Reset unread count khi chọn phòng
        setRooms((prevRooms) => prevRooms.map((r) => (r._id === room._id ? { ...r, unread_count: 0 } : r)));
        onSelectRoom(room);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header với gradient */}
            <div className="p-4 bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <MessageCircle size={24} />
                        Tin nhắn
                    </h2>
                    {/* Icon arrow left color black */}
                    <Link
                        to={`/projects/${projectId}`}
                        className="p-2 bg-white hover:bg-white/30 rounded-lg transition-colors"
                        title="Quay lại dự án"
                    >
                        <ArrowLeft size={20} color="black" />
                    </Link>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/90 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Room list */}
            <div className="flex-1 overflow-y-auto">
                {filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400">
                        {searchQuery ? (
                            <>
                                <Search size={48} className="mb-4 opacity-50" />
                                <p className="text-center">Không tìm thấy cuộc trò chuyện</p>
                            </>
                        ) : (
                            <>
                                <MessageCircle size={48} className="mb-4 opacity-50" />
                                <p className="text-center">Chưa có cuộc trò chuyện nào</p>
                            </>
                        )}
                    </div>
                ) : (
                    filteredRooms.map((room) => (
                        <button
                            key={room._id}
                            onClick={() => handleSelectRoom(room)}
                            className={`w-full p-4 text-left transition-all border-b border-gray-100 ${
                                selectedRoomId === room._id
                                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar với online indicator */}
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                                        {room.type === 'direct' && room.other_member?.avatar_url ? (
                                            <img
                                                src={room.other_member.avatar_url}
                                                alt={getRoomName(room)}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : room.type === 'group' ? (
                                            <Users className="text-white" size={20} />
                                        ) : (
                                            <span className="text-white font-bold text-lg">
                                                {getRoomName(room).charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    {/* Online indicator - chỉ cho direct chat */}
                                    {room.type === 'direct' && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3
                                            className={`font-semibold truncate ${
                                                room.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'
                                            }`}
                                        >
                                            {getRoomName(room)}
                                        </h3>
                                        <span className="text-xs text-gray-500 ml-2 shrink-0">
                                            {getLastMessageTime(room)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center gap-2">
                                        <p
                                            className={`text-sm truncate ${
                                                room.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                            }`}
                                        >
                                            {getLastMessage(room)}
                                        </p>
                                        {room.unread_count > 0 && (
                                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 shrink-0 min-w-5 text-center">
                                                {room.unread_count > 99 ? '99+' : room.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
