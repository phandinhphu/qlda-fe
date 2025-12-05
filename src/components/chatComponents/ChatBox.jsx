import { useState, useEffect, useRef } from 'react';
import { getChatMessages } from '../../services/chatServices';
import { useSocket } from '../../hooks/socket';
import { useAuth } from '../../hooks/auth';
import { Send } from 'lucide-react';

export default function ChatBox({ room }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [typing, setTyping] = useState({});
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { socket, joinRoom, leaveRoom, sendMessage: sendSocketMessage, sendTyping } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (room) {
            loadMessages();
            joinRoom(room._id);
        }

        return () => {
            if (room) {
                leaveRoom(room._id);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room?._id]);

    useEffect(() => {
        if (!socket || !room) return;

        const handleNewMessage = (data) => {
            if (data.message.room_id === room._id) {
                setMessages((prev) => [...prev, data.message]);
            }
        };

        const handleUserTyping = (data) => {
            setTyping((prev) => {
                const newTyping = { ...prev };
                if (data.isTyping) {
                    newTyping[data.userId] = data.userName || 'Ai đó';
                } else {
                    delete newTyping[data.userId];
                }
                return newTyping;
            });
        };
        socket.on('new_message', handleNewMessage);
        socket.on('user_typing', handleUserTyping);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('user_typing', handleUserTyping);
        };
    }, [socket, room]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        if (!room) return;

        try {
            setLoading(true);
            const response = await getChatMessages(room._id);
            if (response.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !room) return;

        sendSocketMessage(room._id, inputMessage);
        setInputMessage('');
        sendTyping(room._id, false);
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);

        if (!room) return;

        // Gửi typing indicator
        sendTyping(room._id, true);

        // Clear timeout cũ
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout mới để ngừng typing
        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(room._id, false);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const getRoomName = () => {
        if (!room) return '';
        if (room.type === 'direct' && room.other_member) {
            return room.other_member.name;
        }
        return room.name;
    };

    if (!room) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>Chọn một phòng chat để bắt đầu</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b bg-white">
                <h2 className="text-lg font-semibold">{getRoomName()}</h2>
                {room.type === 'group' && <p className="text-sm text-gray-500">{room.project_id?.project_name}</p>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-500">Đang tải tin nhắn...</div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-500">Chưa có tin nhắn nào</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <MessageItem key={msg._id} message={msg} user={user} />
                        ))}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Typing indicators - Fixed position above input */}
            {Object.keys(typing).length > 0 && (
                <div className="px-4 py-2 bg-white border-t">
                    <div className="text-sm text-gray-500 italic flex items-center gap-2">
                        <div className="flex gap-1">
                            <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0ms' }}
                            ></span>
                            <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '150ms' }}
                            ></span>
                            <span
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '300ms' }}
                            ></span>
                        </div>
                        <span>
                            {Object.values(typing).length === 1
                                ? `${Object.values(typing)[0]} đang nhập...`
                                : Object.values(typing).length === 2
                                  ? `${Object.values(typing)[0]} và ${Object.values(typing)[1]} đang nhập...`
                                  : `${Object.values(typing)[0]} và ${Object.values(typing).length - 1} người khác đang nhập...`}
                        </span>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Viết bình luận..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function MessageItem({ message, user }) {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isCurrentUser = message.sender_id?._id === user?._id;

    if (isCurrentUser) {
        // Tin nhắn của mình - bên phải
        return (
            <div className="flex gap-3 justify-end">
                <div className="flex flex-col items-end max-w-[70%]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
                        <span className="font-medium text-sm">Bạn</span>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">{message.message}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-blue-700 text-sm font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    // Tin nhắn của người khác - bên trái
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
                {message.sender_id?.avatar_url ? (
                    <img
                        src={message.sender_id.avatar_url}
                        alt={message.sender_id.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <span className="text-purple-700 text-sm font-semibold">
                        {message.sender_id?.name?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="flex flex-col max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.sender_id?.name}</span>
                    <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
                </div>
                <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">{message.message}</div>
            </div>
        </div>
    );
}

function MessageCircle({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}
