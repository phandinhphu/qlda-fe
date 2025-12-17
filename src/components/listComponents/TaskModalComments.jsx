import { useState, useEffect } from 'react';
import { addComment, getComments, updateComment, deleteComment } from '../../services/taskServices';
import { useAuth } from '../../hooks/auth';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalComments({ task, onUpdate }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Load comments when task changes
    useEffect(() => {
        if (task?._id) {
            loadComments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task?._id]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const commentsData = await getComments(task._id);
            setComments(commentsData || []);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;

        try {
            const createdComment = await addComment(task._id, { content: newComment });
            const updatedComments = [...comments, createdComment];
            setComments(updatedComments);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert(error.message);
        }
    };

    const handleStartEdit = (comment) => {
        setEditingCommentId(comment._id);
        setEditingContent(comment.content);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const handleSaveEdit = async (commentId) => {
        if (editingContent.trim() === '') {
            alert('Nội dung bình luận không được để trống');
            return;
        }

        try {
            const updatedComment = await updateComment(task._id, commentId, { content: editingContent });
            const updatedComments = comments.map((c) => (c._id === commentId ? updatedComment : c));
            setComments(updatedComments);
            setEditingCommentId(null);
            setEditingContent('');
        } catch (error) {
            console.error('Error updating comment:', error);
            alert(error.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
            return;
        }

        try {
            await deleteComment(task._id, commentId);
            const updatedComments = comments.filter((c) => c._id !== commentId);
            setComments(updatedComments);
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert(error.message);
        }
    };

    const isCommentOwner = (comment) => {
        return user && comment.user_id && (comment.user_id._id === user._id || comment.user_id === user._id);
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
                    placeholder="Viết bình luận... (Nhấn Enter để gửi, Shift+Enter để xuống dòng)"
                    className="w-full bg-gray-700 text-white placeholder-gray-400 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-20 mb-2"
                />
                <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm transition-colors"
                >
                    Gửi
                </button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">Chưa có bình luận nào</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 group">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                                {comment.user_id?.name?.charAt(0).toUpperCase() || 'M'}
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <div className="bg-gray-800 rounded-lg p-3 relative">
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="font-medium text-sm text-white">
                                            {comment.user_id?.name || 'Member'}
                                        </p>
                                        {isCommentOwner(comment) && (
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {editingCommentId !== comment._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleStartEdit(comment)}
                                                            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Icon name="edit" className="text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <Icon name="delete" className="text-sm" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveEdit(comment._id)}
                                                            className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                                                            title="Lưu"
                                                        >
                                                            <Icon name="check" className="text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                                                            title="Hủy"
                                                        >
                                                            <Icon name="close" className="text-sm" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {editingCommentId === comment._id ? (
                                        <textarea
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSaveEdit(comment._id);
                                                } else if (e.key === 'Escape') {
                                                    handleCancelEdit();
                                                }
                                            }}
                                            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-20"
                                            autoFocus
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-200 whitespace-pre-wrap">{comment.content}</p>
                                    )}
                                    {comment.created_at && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(comment.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
