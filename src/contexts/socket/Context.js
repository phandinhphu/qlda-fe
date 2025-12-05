import { createContext } from 'react';

const SocketContext = createContext({
    socket: null,
    isConnected: false,
    joinRoom: () => {},
    leaveRoom: () => {},
    sendMessage: () => {},
    sendTyping: () => {},
});

export default SocketContext;
