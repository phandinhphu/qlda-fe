const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    // Projects
    async getProjects() {
        return this.request('/projects');
    }

    async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    async createProject(projectData) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    }

    async updateProject(id, projectData) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE',
        });
    }

    async addMember(projectId, memberId) {
        return this.request(`/projects/${projectId}/members`, {
            method: 'POST',
            body: JSON.stringify({ memberId }),
        });
    }

    async removeMember(projectId, memberId) {
        return this.request(`/projects/${projectId}/members/${memberId}`, {
            method: 'DELETE',
        });
    }

    // Lists
    async getLists(projectId) {
        return this.request(`/lists/${projectId}`);
    }

    async createList(projectId, listData) {
        return this.request(`/lists/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(listData),
        });
    }

    async updateList(id, listData) {
        return this.request(`/lists/${id}`, {
            method: 'PUT',
            body: JSON.stringify(listData),
        });
    }

    async deleteList(id) {
        return this.request(`/lists/${id}`, {
            method: 'DELETE',
        });
    }

    // Tasks
    async getTask(id) {
        return this.request(`/tasks/${id}`);
    }

    async createTask(listId, taskData) {
        return this.request(`/tasks/${listId}`, {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async updateTask(id, taskData) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    }

    async deleteTask(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }

    async addStep(taskId, stepData) {
        return this.request(`/tasks/${taskId}/steps`, {
            method: 'POST',
            body: JSON.stringify(stepData),
        });
    }

    async updateStep(taskId, stepId, stepData) {
        return this.request(`/tasks/${taskId}/steps/${stepId}`, {
            method: 'PUT',
            body: JSON.stringify(stepData),
        });
    }

    async addLabel(taskId, labelData) {
        return this.request(`/tasks/${taskId}/labels`, {
            method: 'POST',
            body: JSON.stringify(labelData),
        });
    }

    async addComment(taskId, commentData) {
        return this.request(`/tasks/${taskId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    }

    // Chat
    async getChatrooms(projectId) {
        return this.request(`/chat/project/${projectId}`);
    }

    async createChatroom(projectId, chatroomData) {
        return this.request(`/chat/project/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(chatroomData),
        });
    }

    async getMessages(chatroomId) {
        return this.request(`/chat/${chatroomId}/messages`);
    }

    async sendMessage(chatroomId, message) {
        return this.request(`/chat/${chatroomId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }

    // Notifications
    async getNotifications() {
        return this.request('/notifications');
    }

    async getUnreadCount() {
        return this.request('/notifications/unread-count');
    }

    async markAsRead(id) {
        return this.request(`/notifications/${id}/read`, {
            method: 'PUT',
        });
    }

    async markAllAsRead() {
        return this.request('/notifications/mark-all-read', {
            method: 'PUT',
        });
    }

    async deleteNotification(id) {
        return this.request(`/notifications/${id}`, {
            method: 'DELETE',
        });
    }
}

export default new ApiService();
