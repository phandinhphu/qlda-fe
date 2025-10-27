# Backend API - Project Management System

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/project_management
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

3. Initialize MongoDB with sample data:
```bash
mongosh < init_mongo.js
```

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/forgot-password` - Request password reset

### Projects
- `GET /api/projects` - Get all projects (requires auth)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:memberId` - Remove member from project

### Lists
- `GET /api/lists/:projectId` - Get all lists for a project
- `POST /api/lists/:projectId` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

### Tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks/:listId` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/steps` - Add step to task
- `PUT /api/tasks/:id/steps/:stepId` - Update step
- `POST /api/tasks/:id/labels` - Add label to task
- `POST /api/tasks/:id/comments` - Add comment to task

### Chat
- `GET /api/chat/project/:projectId` - Get all chatrooms for a project
- `POST /api/chat/project/:projectId` - Create new chatroom
- `GET /api/chat/:id` - Get single chatroom
- `GET /api/chat/:chatroomId/messages` - Get messages for a chatroom
- `POST /api/chat/:chatroomId/messages` - Send message

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

