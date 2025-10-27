import Task from '../models/Task.js';

// Get single task
export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id)
            .populate('assigned_to', 'name email avatar_url')
            .populate('comments.user_id', 'name email avatar_url');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new task
export const createTask = async (req, res) => {
    try {
        const { listId } = req.params;
        const taskData = req.body;

        const task = await Task.create({
            ...taskData,
            list_id: listId
        });

        await task.populate('assigned_to', 'name email avatar_url');

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const task = await Task.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        .populate('assigned_to', 'name email avatar_url')
        .populate('comments.user_id', 'name email avatar_url');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add step to task
export const addStep = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const step = {
            step_id: new Date().getTime(),
            title,
            is_completed: false,
            position: task.steps.length + 1,
            created_at: new Date()
        };

        task.steps.push(step);
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update step
export const updateStep = async (req, res) => {
    try {
        const { id, stepId } = req.params;
        const { title, is_completed } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const step = task.steps.find(s => s.step_id.toString() === stepId);
        if (!step) {
            return res.status(404).json({ message: 'Step not found' });
        }

        if (title !== undefined) step.title = title;
        if (is_completed !== undefined) step.is_completed = is_completed;

        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add label to task
export const addLabel = async (req, res) => {
    try {
        const { id } = req.params;
        const { label_name, color } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const label = {
            label_id: new Date().getTime(),
            label_name,
            color: color || '#3498db'
        };

        task.labels.push(label);
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add comment to task
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const comment = {
            comment_id: new Date().getTime(),
            user_id: userId,
            content,
            created_at: new Date()
        };

        task.comments.push(comment);
        await task.save();

        await task.populate('comments.user_id', 'name email avatar_url');

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

