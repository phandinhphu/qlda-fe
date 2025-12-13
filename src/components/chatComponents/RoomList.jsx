import { useState, useEffect } from 'react';
import { getUserChatRooms } from '../../services/chatServices';
import { useSocket } from '../../hooks/socket';
import { Icon, MessageCircle, StepBack } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoomList({ onSelectRoom, selectedRoomId, projectId }) {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

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
        return room.last_message.message;
    };

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
        <div className="h-full overflow-y-auto bg-gray-50">
            <div className="p-4 bg-white border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle size={20} />
                    Chat
                </h2>
                <Link to={`/projects/${projectId}`} className="text-lg font-semibold flex items-center gap-2">
                    <StepBack size={14} className="inline-block mr-1" />
                    Back
                </Link>
            </div>

            <div className="divide-y">
                {rooms.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Chưa có phòng chat nào</div>
                ) : (
                    rooms.map((room) => (
                        <button
                            key={room._id}
                            onClick={() => handleSelectRoom(room)}
                            className={`w-full p-4 text-left hover:bg-gray-100 transition-colors ${
                                selectedRoomId === room._id ? 'bg-blue-50' : ''
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
                                    {room.type === 'direct' && room.other_member?.avatar_url ? (
                                        <img
                                            src={room.other_member.avatar_url}
                                            alt={getRoomName(room)}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-purple-700 font-semibold">
                                            {getRoomName(room).charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3
                                            className={`font-medium truncate ${
                                                room.unread_count > 0 ? 'font-bold' : ''
                                            }`}
                                        >
                                            {getRoomName(room)}
                                        </h3>
                                        {room.unread_count > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2 shrink-0">
                                                {room.unread_count > 99 ? '99+' : room.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-sm truncate mt-1 ${
                                            room.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                        }`}
                                    >
                                        {getLastMessage(room)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
