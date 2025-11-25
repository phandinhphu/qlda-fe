import { useState } from 'react';
import { addComment } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalComments({ task, onUpdate }) {
    const [comments, setComments] = useState(task.comments || []);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const createdComment = await addComment(task._id, { content: newComment });
            const updatedComments = [...comments, createdComment];
            setComments(updatedComments);
            setNewComment('');

            // Cập nhật task trong parent
            onUpdate({ ...task, comments: updatedComments });
        } catch (error) {
            console.error('Error adding comment:', error);
            alert(error.message);
        }
    };

    return (
        <div className="bg-gray-600 rounded p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
                <Icon name="chat_bubble_outline" className="text-white" />
                <h3 className="font-semibold text-white">Nhận xét</h3>
            </div>

            {/* Add Comment Form - At Top */}
            <div className="mb-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                        }
                    }}
                    placeholder="Viết bình luận..."
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-20"
                />
            </div>

            {/* Comments List */}
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                            {comment.user_id?.name?.charAt(0).toUpperCase() || 'M'}
                        </div>

                        {/* Comment Content */}
                        <div className="flex-1">
                            <div className="bg-gray-800 rounded-lg p-3">
                                <p className="font-medium text-sm text-white mb-1">
                                    {comment.user_id?.name || 'Member'}
                                </p>
                                <p className="text-sm text-gray-200">{comment.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
