import mongoose from 'mongoose';

const chatroomSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['group', 'direct'],
        default: 'group'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    members: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        joined_at: {
            type: Date,
            default: Date.now
        }
    }]
});

export default mongoose.model('Chatroom', chatroomSchema);

