// ===========================
// 📦 INIT PROJECT MANAGEMENT DB
// ===========================



// ---------------------------
// 1️⃣ USERS
// ---------------------------
db.users.insertMany([
  {
    _id: ObjectId(),
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password",
    avatar_url: "https://example.com/avatar1.jpg",
    created_at: new Date()
  },
  {
    _id: ObjectId(),
    name: "Jane Smith",
    email: "jane@example.com",
    password: "hashed_password",
    avatar_url: "https://example.com/avatar2.jpg",
    created_at: new Date()
  }
]);

// ---------------------------
// 2️⃣ PROJECTS
// ---------------------------
db.projects.insertOne({
  _id: ObjectId(),
  project_name: "Website Redesign",
  description: "Redesign company website with new branding",
  created_by: db.users.findOne({ email: "john@example.com" })._id,
  created_at: new Date(),
  members: [
    {
      user_id: db.users.findOne({ email: "john@example.com" })._id,
      role: "admin",
      joined_at: new Date()
    },
    {
      user_id: db.users.findOne({ email: "jane@example.com" })._id,
      role: "member",
      joined_at: new Date()
    }
  ]
});

// ---------------------------
// 3️⃣ LISTS
// ---------------------------
db.lists.insertMany([
  {
    _id: ObjectId(),
    project_id: db.projects.findOne({ project_name: "Website Redesign" })._id,
    title: "To Do",
    position: 1,
    created_at: new Date()
  },
  {
    _id: ObjectId(),
    project_id: db.projects.findOne({ project_name: "Website Redesign" })._id,
    title: "In Progress",
    position: 2,
    created_at: new Date()
  }
]);

// ---------------------------
// 4️⃣ TASKS
// ---------------------------
db.tasks.insertOne({
  _id: ObjectId(),
  list_id: db.lists.findOne({ title: "To Do" })._id,
  assigned_to: db.users.findOne({ email: "jane@example.com" })._id,
  title: "Design Home Page",
  description: "Create modern homepage layout",
  status: "pending",
  start_date: new Date("2025-10-25"),
  due_date: new Date("2025-10-30"),
  priority: "high",
  created_at: new Date(),
  steps: [
    {
      step_id: ObjectId(),
      title: "Make wireframe",
      is_completed: false,
      position: 1,
      created_at: new Date()
    },
    {
      step_id: ObjectId(),
      title: "Add responsive design",
      is_completed: false,
      position: 2,
      created_at: new Date()
    }
  ],
  labels: [
    {
      label_id: ObjectId(),
      label_name: "UI Design",
      color: "#ff9800"
    }
  ],
  comments: [
    {
      comment_id: ObjectId(),
      user_id: db.users.findOne({ email: "john@example.com" })._id,
      content: "Please use company color palette",
      created_at: new Date()
    }
  ],
  files: [
    {
      file_id: ObjectId(),
      file_url: "https://files.example.com/wireframe.pdf",
      uploaded_by: db.users.findOne({ email: "jane@example.com" })._id,
      uploaded_at: new Date()
    }
  ]
});

// ---------------------------
// 5️⃣ CHAT ROOMS
// ---------------------------
db.chatrooms.insertOne({
  _id: ObjectId(),
  project_id: db.projects.findOne({ project_name: "Website Redesign" })._id,
  name: "Design Team Chat",
  type: "group",
  created_at: new Date(),
  members: [
    {
      user_id: db.users.findOne({ email: "john@example.com" })._id,
      joined_at: new Date()
    },
    {
      user_id: db.users.findOne({ email: "jane@example.com" })._id,
      joined_at: new Date()
    }
  ]
});

// ---------------------------
// 6️⃣ CHAT MESSAGES
// ---------------------------
db.chatmessages.insertMany([
  {
    _id: ObjectId(),
    room_id: db.chatrooms.findOne({ name: "Design Team Chat" })._id,
    sender_id: db.users.findOne({ email: "john@example.com" })._id,
    message: "Hey team, let’s start the homepage design today!",
    created_at: new Date()
  },
  {
    _id: ObjectId(),
    room_id: db.chatrooms.findOne({ name: "Design Team Chat" })._id,
    sender_id: db.users.findOne({ email: "jane@example.com" })._id,
    message: "Got it! I’ll share the wireframe soon.",
    created_at: new Date()
  }
]);

// ---------------------------
// 7️⃣ NOTIFICATIONS
// ---------------------------
db.notifications.insertOne({
  _id: ObjectId(),
  user_id: db.users.findOne({ email: "jane@example.com" })._id,
  project_id: db.projects.findOne({ project_name: "Website Redesign" })._id,
  message: "You’ve been added to the project 'Website Redesign'",
  is_read: false,
  created_at: new Date()
});

print("✅ MongoDB Project Management Database Initialized Successfully!");
