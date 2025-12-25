import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import SocketContext from './Context';
import { API_URL } from '../../utils/constants';
import { getSocketToken } from '../../services/socketAuthService';
import { useAuth } from '../../hooks/auth';

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        const initSocket = async () => {
            try {
                // Lấy token từ backend (endpoint này sẽ trả token dưới dạng JSON, không phải httpOnly)
                const token = await getSocketToken();

                if (!token) {
                    console.log('No token available, skipping socket connection');
                    return;
                }

                const socketURL = API_URL || 'http://localhost:5000';

                // Gửi token qua auth hoặc extraHeaders
                const newSocket = io(socketURL, {
                    auth: {
                        token: token,
                    },
                    extraHeaders: {
                        authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                    transports: ['websocket', 'polling'],
                    autoConnect: true,
                });

                newSocket.on('connect', () => {
                    console.log('Socket connected:', newSocket.id);
                    setIsConnected(true);
                });

                newSocket.on('disconnect', (reason) => {
                    console.log('Socket disconnected:', reason);
                    setIsConnected(false);
                });

                newSocket.on('connect_error', (error) => {
                    console.error('Socket connection error:', error.message);
                    setIsConnected(false);
                });

                newSocket.on('error', (data) => {
                    console.error('Socket error:', data.message);
                });

                setSocket(newSocket);

                return () => {
                    newSocket.close();
                };
            } catch (error) {
                console.error('Failed to initialize socket:', error);
            }
        };

        initSocket();
    }, []);

    const onlineTracking = useCallback(
        (userId) => {
            if (userId) {
                socket.emit('user_online', userId);
            }
        },
        [socket],
    );

    const disconnectTracking = useCallback(() => {
        if (socket) {
            socket.emit('user_offline');
        }
    }, [socket]);

    useEffect(() => {
        console.log('AuthProvider useEffect - socket or user changed:', { socket, user });
        if (socket && user) {
            onlineTracking(user._id);
        }

        return () => {
            if (socket && user) {
                disconnectTracking(user._id);
            }
        };
    }, [socket, user, onlineTracking, disconnectTracking]);

    const joinRoom = useCallback(
        (roomId) => {
            if (socket) {
                socket.emit('join_room', { roomId });
            }
        },
        [socket],
    );

    const leaveRoom = useCallback(
        (roomId) => {
            if (socket) {
                socket.emit('leave_room', { roomId });
            }
        },
        [socket],
    );

    const sendMessage = useCallback(
        (roomId, message) => {
            if (socket) {
                socket.emit('send_message', { roomId, message });
            }
        },
        [socket],
    );

    const sendTyping = useCallback(
        (roomId, isTyping) => {
            if (socket) {
                socket.emit('typing', { roomId, isTyping });
            }
        },
        [socket],
    );

    const value = {
        socket,
        isConnected,
        onlineTracking,
        disconnectTracking,
        joinRoom,
        leaveRoom,
        sendMessage,
        sendTyping,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
