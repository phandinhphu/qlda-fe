import express from 'express';
import {
    getLists,
    createList,
    updateList,
    deleteList
} from '../controllers/listController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:projectId', getLists);
router.post('/:projectId', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;

