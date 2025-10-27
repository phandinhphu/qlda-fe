import Notification from '../models/Notification.js';

// Get all notifications for current user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ user_id: userId })
            .populate('project_id', 'project_name')
            .sort({ created_at: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;
        const count = await Notification.countDocuments({
            user_id: userId,
            is_read: false
        });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { is_read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany(
            { user_id: userId, is_read: false },
            { is_read: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

