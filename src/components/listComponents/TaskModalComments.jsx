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
        <div className="h-full">
            <div className="flex items-center gap-3 mb-4">
                <Icon name="chat_bubble_outline" className="text-gray-700 text-xl" />
                <h3 className="font-semibold text-gray-800 text-lg">Hoạt động</h3>
            </div>

            {/* Add Comment Form */}
            <div className="mb-6 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold shrink-0 shadow-sm border border-blue-200">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
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
                        className="w-full bg-white text-gray-800 placeholder-gray-400 p-3 text-sm focus:outline-none min-h-[40px] resize-y"
                        rows={1}
                        style={{ minHeight: '40px' }}
                    />
                    {newComment.trim() && (
                        <div className="flex justify-end px-2 pb-2">
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            >
                                Lưu
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-400 text-sm italic pl-11">Chưa có bình luận nào</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 group">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold shrink-0 border border-gray-300">
                                {comment.user_id?.name?.charAt(0).toUpperCase() || 'M'}
                            </div>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-800">
                                        {comment.user_id?.name || 'Member'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {comment.created_at && new Date(comment.created_at).toLocaleString('vi-VN')}
                                    </span>
                                </div>

                                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 relative group/item">
                                    {editingCommentId === comment._id ? (
                                        <>
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
                                                className="w-full bg-white text-gray-800 border border-gray-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                                                autoFocus
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleSaveEdit(comment._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="text-gray-600 hover:bg-gray-100 px-2 py-1 rounded text-xs"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed text-left">
                                            {comment.content}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {isCommentOwner(comment) && editingCommentId !== comment._id && (
                                    <div className="flex gap-2 mt-1 pl-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleStartEdit(comment)}
                                            className="text-xs text-gray-500 hover:underline hover:text-gray-700"
                                        >
                                            Chỉnh sửa
                                        </button>
                                        <span className="text-xs text-gray-300">•</span>
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-xs text-gray-500 hover:underline hover:text-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
