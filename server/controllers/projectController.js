import Project from '../models/Project.js';
import List from '../models/List.js';

// Get all projects for current user
export const getProjects = async (req, res) => {
    try {
        const userId = req.userId;
        const projects = await Project.find({
            $or: [
                { created_by: userId },
                { 'members.user_id': userId }
            ]
        })
        .populate('created_by', 'name email avatar_url')
        .populate('members.user_id', 'name email avatar_url')
        .sort({ created_at: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single project by ID
export const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id)
            .populate('created_by', 'name email avatar_url')
            .populate('members.user_id', 'name email avatar_url');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new project
export const createProject = async (req, res) => {
    try {
        const { project_name, description } = req.body;
        const userId = req.userId;

        const project = await Project.create({
            project_name,
            description,
            created_by: userId,
            members: [{
                user_id: userId,
                role: 'admin',
                joined_at: new Date()
            }]
        });

        await project.populate('created_by', 'name email avatar_url');
        await project.populate('members.user_id', 'name email avatar_url');

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { project_name, description } = req.body;

        const project = await Project.findByIdAndUpdate(
            id,
            { project_name, description },
            { new: true }
        )
        .populate('created_by', 'name email avatar_url')
        .populate('members.user_id', 'name email avatar_url');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete associated lists
        await List.deleteMany({ project_id: id });

        // Delete project
        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add member to project
export const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { memberId } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if member already exists
        const memberExists = project.members.some(
            m => m.user_id.toString() === memberId
        );

        if (memberExists) {
            return res.status(400).json({ message: 'Member already added' });
        }

        project.members.push({
            user_id: memberId,
            role: 'member',
            joined_at: new Date()
        });

        await project.save();
        await project.populate('members.user_id', 'name email avatar_url');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove member from project
export const removeMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.members = project.members.filter(
            m => m.user_id.toString() !== memberId
        );

        await project.save();
        await project.populate('members.user_id', 'name email avatar_url');

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

