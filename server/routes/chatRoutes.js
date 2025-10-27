import express from 'express';
import {
    getChatrooms,
    getChatroom,
    createChatroom,
    getMessages,
    sendMessage
} from '../controllers/chatController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/project/:projectId', getChatrooms);
router.post('/project/:projectId', createChatroom);
router.get('/:id', getChatroom);
router.get('/:chatroomId/messages', getMessages);
router.post('/:chatroomId/messages', sendMessage);

export default router;

