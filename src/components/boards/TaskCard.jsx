import { useState } from 'react';
import { CheckCircle2, Circle, Calendar, User } from 'lucide-react';
import * as taskService from '../../services/taskService';

const TaskCard = ({ task, onUpdate, onEdit, onDelete }) => {
    const [isCompleted, setIsCompleted] = useState(task.is_completed || false);
    const [isToggling, setIsToggling] = useState(false);

    const handleToggleComplete = async (e) => {
        e.stopPropagation();
        if (isToggling) return;

        const previousState = isCompleted;
        setIsCompleted(!previousState); // Optimistic update
        setIsToggling(true);

        try {
            await taskService.toggleTaskComplete(task._id);
            if (onUpdate) onUpdate();
        } catch (error) {
            setIsCompleted(previousState); // Rollback
            console.error('Failed to toggle task:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(date);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate.getTime() === today.getTime()) {
            return 'Hôm nay';
        }

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (taskDate.getTime() === tomorrow.getTime()) {
            return 'Ngày mai';
        }

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        });
    };

    const isOverdue = () => {
        if (!task.due_date || isCompleted) return false;
        const dueDate = new Date(task.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    const dueDate = formatDate(task.due_date);
    const overdue = isOverdue();

    return (
        <div
            className={`bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border ${
                isCompleted ? 'opacity-60 border-gray-200' : 'border-gray-200'
            }`}
            onClick={() => onEdit && onEdit(task)}
        >
            <div className="flex items-start gap-2">
                <button
                    onClick={handleToggleComplete}
                    disabled={isToggling}
                    className="mt-0.5 flex-shrink-0 hover:opacity-70 transition-opacity disabled:opacity-50"
                >
                    {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <h4
                        className={`text-sm font-medium text-gray-900 mb-1 ${
                            isCompleted ? 'line-through text-gray-500' : ''
                        }`}
                    >
                        {task.title}
                    </h4>

                    {task.description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {/* Due Date */}
                        {dueDate && (
                            <div
                                className={`flex items-center gap-1 text-xs ${
                                    overdue
                                        ? 'text-red-600 font-medium'
                                        : isCompleted
                                          ? 'text-gray-400'
                                          : 'text-gray-600'
                                }`}
                            >
                                <Calendar className="w-3 h-3" />
                                <span>{dueDate}</span>
                            </div>
                        )}

                        {/* Assignee */}
                        {task.assigned_to && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                                <User className="w-3 h-3" />
                                <span className="truncate max-w-[80px]">
                                    {task.assigned_to.name || task.assigned_to.email}
                                </span>
                            </div>
                        )}

                        {/* Priority Badge */}
                        {task.priority && task.priority !== 'medium' && (
                            <span
                                className={`text-xs px-1.5 py-0.5 rounded ${
                                    task.priority === 'urgent'
                                        ? 'bg-red-100 text-red-700'
                                        : task.priority === 'high'
                                          ? 'bg-orange-100 text-orange-700'
                                          : 'bg-blue-100 text-blue-700'
                                }`}
                            >
                                {task.priority === 'urgent' ? 'Khẩn' : task.priority === 'high' ? 'Cao' : 'Thấp'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions (on hover) */}
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                {onEdit && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700"
                    >
                        Chỉnh sửa
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Bạn có chắc muốn xóa task này?')) {
                                onDelete(task);
                            }
                        }}
                        className="text-xs text-red-600 hover:text-red-700 ml-auto"
                    >
                        Xóa
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
