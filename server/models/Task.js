import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    start_date: {
        type: Date
    },
    due_date: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    steps: [{
        step_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId
        },
        title: {
            type: String,
            required: true
        },
        is_completed: {
            type: Boolean,
            default: false
        },
        position: {
            type: Number
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }],
    labels: [{
        label_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId
        },
        label_name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#3498db'
        }
    }],
    comments: [{
        comment_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    }],
    files: [{
        file_id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId
        },
        file_url: {
            type: String,
            required: true
        },
        uploaded_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        uploaded_at: {
            type: Date,
            default: Date.now
        }
    }]
});

export default mongoose.model('Task', taskSchema);

