# API Reference

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar_url": ""
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

## 📁 Projects

### Get All Projects
```http
GET /projects
Authorization: Bearer <token>
```

### Create Project
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_name": "Website Redesign",
  "description": "Redesign company website"
}
```

### Update Project
```http
PUT /projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_name": "Updated Name",
  "description": "Updated description"
}
```

### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

### Add Member to Project
```http
POST /projects/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "user_id_here"
}
```

### Remove Member from Project
```http
DELETE /projects/:id/members/:memberId
Authorization: Bearer <token>
```

---

## 📋 Lists

### Get All Lists for a Project
```http
GET /lists/:projectId
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "list_id",
    "title": "To Do",
    "position": 1,
    "tasks": [...]
  }
]
```

### Create List
```http
POST /lists/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "In Progress"
}
```

### Update List
```http
PUT /lists/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "position": 2
}
```

### Delete List
```http
DELETE /lists/:id
Authorization: Bearer <token>
```

---

## ✅ Tasks

### Get Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

### Create Task
```http
POST /tasks/:listId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design Home Page",
  "description": "Create modern homepage layout",
  "assigned_to": "user_id",
  "due_date": "2025-10-30",
  "priority": "high"
}
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "completed"
}
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Add Step to Task
```http
POST /tasks/:id/steps
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Make wireframe"
}
```

### Update Step
```http
PUT /tasks/:id/steps/:stepId
Authorization: Bearer <token>
Content-Type: application/json

{
  "is_completed": true
}
```

### Add Label to Task
```http
POST /tasks/:id/labels
Authorization: Bearer <token>
Content-Type: application/json

{
  "label_name": "UI Design",
  "color": "#ff9800"
}
```

### Add Comment to Task
```http
POST /tasks/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Please use company color palette"
}
```

---

## 💬 Chat

### Get Chatrooms for Project
```http
GET /chat/project/:projectId
Authorization: Bearer <token>
```

### Create Chatroom
```http
POST /chat/project/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Design Team Chat",
  "type": "group"
}
```

### Get Messages
```http
GET /chat/:chatroomId/messages
Authorization: Bearer <token>
```

### Send Message
```http
POST /chat/:chatroomId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Hey team, let's start the homepage design today!"
}
```

---

## 🔔 Notifications

### Get All Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /notifications/mark-all-read
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

---

## 🚨 Error Response Format

```json
{
  "message": "Error message here"
}
```

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

