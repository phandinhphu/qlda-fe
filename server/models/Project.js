import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    project_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    members: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        },
        joined_at: {
            type: Date,
            default: Date.now
        }
    }]
});

export default mongoose.model('Project', projectSchema);

