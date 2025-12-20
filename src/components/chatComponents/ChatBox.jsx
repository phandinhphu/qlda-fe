import { useState, useEffect, useRef } from 'react';
import { getChatMessages } from '../../services/chatServices';
import { useSocket } from '../../hooks/socket';
import { useAuth } from '../../hooks/auth';
import { Send, Smile, Paperclip, MoreVertical, Users, User } from 'lucide-react';

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

        const newMessaeg = {
            room_id: room._id,
            message: inputMessage,
            sender_id: user,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessaeg]);

        sendSocketMessage(room._id, inputMessage);
        sendTyping(room._id, false);
        setInputMessage('');
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
            <div className="flex items-center justify-center h-full bg-linear-to-br from-gray-50 to-gray-100">
                <div className="text-center px-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl">
                        <MessageCircle size={48} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Chào mừng đến với Chat</h3>
                    <p className="text-gray-500">Chọn một cuộc trò chuyện bên trái để bắt đầu nhắn tin</p>
                </div>
            </div>
        );
    }

    console.log('Messages:', messages);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header với gradient */}
            <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-md">
                            {room.type === 'direct' && room.other_member?.avatar_url ? (
                                <img
                                    src={room.other_member.avatar_url}
                                    alt={getRoomName()}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : room.type === 'group' ? (
                                <Users size={20} className="text-white" />
                            ) : (
                                <User size={20} className="text-white" />
                            )}
                        </div>

                        {/* Room info */}
                        <div>
                            <h2 className="text-lg font-bold">{getRoomName()}</h2>
                            {room.type === 'group' && room.project_id?.project_name && (
                                <p className="text-sm text-blue-100 flex items-center gap-1">
                                    <Users size={14} />
                                    {room.project_id.project_name}
                                </p>
                            )}
                            {room.type === 'direct' && <p className="text-xs text-blue-100">Hoạt động</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div
                className="flex-1 overflow-y-auto p-6"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(243, 244, 246, 0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(243, 244, 246, 0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundColor: '#f9fafb',
                }}
            >
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

            {/* Typing indicators */}
            {Object.keys(typing).length > 0 && (
                <div className="px-6 py-3 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <span
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: '0ms' }}
                            ></span>
                            <span
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: '150ms' }}
                            ></span>
                            <span
                                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                style={{ animationDelay: '300ms' }}
                            ></span>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">
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
            <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-end gap-3">
                    {/* Action buttons */}
                    <div className="flex gap-2 pb-2">
                        <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Thêm emoji"
                        >
                            <Smile size={20} />
                        </button>
                        <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Đính kèm file"
                        >
                            <Paperclip size={20} />
                        </button>
                    </div>

                    {/* Input field */}
                    <div className="flex-1">
                        <textarea
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            rows="1"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 resize-none transition-colors"
                            style={{ maxHeight: '120px' }}
                        />
                    </div>

                    {/* Send button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="p-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center"
                        title="Gửi tin nhắn"
                    >
                        <Send size={20} />
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
            <div className="flex gap-3 justify-end animate-fade-in">
                <div className="flex flex-col items-end max-w-[75%]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-700">Bạn</span>
                        <span className="text-xs text-gray-400 font-medium">{formatTime(message.created_at)}</span>
                    </div>
                    <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-md">
                        <p className="text-sm leading-relaxed wrap-break-word">{message.message}</p>
                    </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                    )}
                </div>
            </div>
        );
    }

    // Tin nhắn của người khác - bên trái
    return (
        <div className="flex gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                {message.sender_id?.avatar_url ? (
                    <img
                        src={message.sender_id.avatar_url}
                        alt={message.sender_id.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                ) : (
                    <span className="text-white text-sm font-bold">
                        {message.sender_id?.name?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="flex flex-col items-start max-w-[75%]">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-700">{message.sender_id?.name}</span>
                    <span className="text-xs text-gray-400 font-medium">{formatTime(message.created_at)}</span>
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-md border border-gray-100">
                    <p className="text-sm text-gray-800 leading-relaxed wrap-break-word">{message.message}</p>
                </div>
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
