import { useState } from 'react';
import RoomList from '../components/chatComponents/RoomList';
import ChatBox from '../components/chatComponents/ChatBox';
import { useParams } from 'react-router-dom';

export default function Chat() {
    const { projectId } = useParams();
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
    };

    return (
        <div className="h-screen flex bg-gray-100">
            {/* Sidebar - Room List */}
            <div className="w-80 border-r bg-white">
                <RoomList onSelectRoom={handleSelectRoom} selectedRoomId={selectedRoom?._id} projectId={projectId} />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1">
                <ChatBox room={selectedRoom} />
            </div>
        </div>
    );
}
