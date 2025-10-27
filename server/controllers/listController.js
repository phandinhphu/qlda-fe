import List from '../models/List.js';
import Task from '../models/Task.js';

// Get all lists for a project
export const getLists = async (req, res) => {
    try {
        const { projectId } = req.params;
        const lists = await List.find({ project_id: projectId })
            .sort({ position: 1 });

        // Get tasks for each list
        const listsWithTasks = await Promise.all(
            lists.map(async (list) => {
                const tasks = await Task.find({ list_id: list._id })
                    .populate('assigned_to', 'name email avatar_url')
                    .sort({ created_at: 1 });
                return { ...list.toObject(), tasks };
            })
        );

        res.json(listsWithTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new list
export const createList = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title } = req.body;

        // Get the highest position
        const lastList = await List.findOne({ project_id: projectId })
            .sort({ position: -1 });

        const position = lastList ? lastList.position + 1 : 1;

        const list = await List.create({
            project_id: projectId,
            title,
            position
        });

        res.status(201).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update list
export const updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, position } = req.body;

        const list = await List.findByIdAndUpdate(
            id,
            { title, position },
            { new: true }
        );

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete list
export const deleteList = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete associated tasks
        await Task.deleteMany({ list_id: id });

        // Delete list
        const list = await List.findByIdAndDelete(id);

        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }

        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

