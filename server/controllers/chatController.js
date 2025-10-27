import Chatroom from '../models/Chatroom.js';
import Chatmessage from '../models/Chatmessage.js';

// Get all chatrooms for a project
export const getChatrooms = async (req, res) => {
    try {
        const { projectId } = req.params;
        const chatrooms = await Chatroom.find({ project_id: projectId })
            .populate('members.user_id', 'name email avatar_url')
            .sort({ created_at: -1 });

        res.json(chatrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single chatroom
export const getChatroom = async (req, res) => {
    try {
        const { id } = req.params;
        const chatroom = await Chatroom.findById(id)
            .populate('members.user_id', 'name email avatar_url');

        if (!chatroom) {
            return res.status(404).json({ message: 'Chatroom not found' });
        }

        res.json(chatroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create chatroom
export const createChatroom = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, type } = req.body;
        const userId = req.userId;

        const chatroom = await Chatroom.create({
            project_id: projectId,
            name,
            type: type || 'group',
            members: [{
                user_id: userId,
                joined_at: new Date()
            }]
        });

        await chatroom.populate('members.user_id', 'name email avatar_url');

        res.status(201).json(chatroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get messages for a chatroom
export const getMessages = async (req, res) => {
    try {
        const { chatroomId } = req.params;
        const messages = await Chatmessage.find({ room_id: chatroomId })
            .populate('sender_id', 'name email avatar_url')
            .sort({ created_at: 1 })
            .limit(100);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { chatroomId } = req.params;
        const { message } = req.body;
        const userId = req.userId;

        const chatmessage = await Chatmessage.create({
            room_id: chatroomId,
            sender_id: userId,
            message
        });

        await chatmessage.populate('sender_id', 'name email avatar_url');

        res.status(201).json(chatmessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

