import express from 'express';
import {
    getTask,
    createTask,
    updateTask,
    deleteTask,
    addStep,
    updateStep,
    addLabel,
    addComment
} from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:id', getTask);
router.post('/:listId', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/steps', addStep);
router.put('/:id/steps/:stepId', updateStep);
router.post('/:id/labels', addLabel);
router.post('/:id/comments', addComment);

export default router;

