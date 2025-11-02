import { useState, useEffect } from 'react';
import { X, Calendar, User, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/auth';

const TaskModal = ({ isOpen, onClose, task, onSave, onDelete, isLoading = false }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: null,
        due_date: '',
        priority: 'medium',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                assigned_to: task.assigned_to?._id || '',
                due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                priority: task.priority || 'medium',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                assigned_to: '',
                due_date: '',
                priority: 'medium',
            });
        }
    }, [task, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        const dataToSave = {
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            assigned_to: formData.assigned_to || null,
            due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
            priority: formData.priority,
        };

        if (onSave) {
            await onSave(dataToSave);
        }
    };

    const handleDelete = () => {
        if (window.confirm('Bạn có chắc muốn xóa task này?')) {
            if (onDelete) {
                onDelete(task);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-900">{task ? 'Chỉnh sửa Task' : 'Tạo Task Mới'}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tiêu đề task..."
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Nhập mô tả task..."
                                disabled={isLoading}
                            />
                        </div>

                        {/* Due Date */}
                        <div>
                            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Hạn hoàn thành
                            </label>
                            <input
                                type="date"
                                id="due_date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                Mức độ ưu tiên
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            >
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                                <option value="urgent">Khẩn cấp</option>
                            </select>
                        </div>

                        {/* Assignee - Simplified for now (just assign to current user or unassign) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <User className="w-4 h-4 inline mr-1" />
                                Người được gán
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.assigned_to === user?._id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                assigned_to: e.target.checked ? user?._id || '' : '',
                                            })
                                        }
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        disabled={isLoading || !user}
                                    />
                                    <span className="text-sm text-gray-700">
                                        {user ? `Gán cho tôi (${user.name || user.email})` : 'Vui lòng đăng nhập'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 flex-shrink-0">
                    <div>
                        {task && onDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Xóa</span>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading || !formData.title.trim()}
                            className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
