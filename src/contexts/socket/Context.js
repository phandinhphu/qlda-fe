import { createContext } from 'react';

const SocketContext = createContext({
    socket: null,
    isConnected: false,
    onlineTracking: () => {},
    disconnectTracking: () => {},
    joinRoom: () => {},
    leaveRoom: () => {},
    sendMessage: () => {},
    sendTyping: () => {},
});

export default SocketContext;
