import { useState, useEffect } from 'react';
import { updateTask } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalDescription({ task, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(task.description || '');

    // Đồng bộ state với prop khi task thay đổi
    useEffect(() => {
        setDescription(task?.description || '');
    }, [task?._id, task?.description]);

    const handleSave = async () => {
        try {
            const updatedTask = await updateTask(task._id, { description });
            onUpdate(updatedTask);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating description:', error);
            alert(error.message);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <Icon name="subject" className="text-gray-700 text-xl" />
                <h3 className="font-semibold text-gray-800 text-lg">Mô tả</h3>
            </div>

            {isEditing ? (
                <div className="ml-8 animate-fadeIn">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-200 ring-2 ring-blue-500/20 focus-within:ring-blue-500/50">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Thêm mô tả chi tiết hơn..."
                            className="w-full border-none p-4 focus:outline-none focus:ring-0 min-h-[120px] text-sm text-gray-800 resize-y placeholder-gray-400 leading-relaxed bg-transparent"
                            autoFocus
                        />
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
                            <div className="text-xs text-gray-400 italic">Nhấn Enter để xuống dòng</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
                                >
                                    <span>Lưu</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setDescription(task.description || '');
                                        setIsEditing(false);
                                    }}
                                    className="bg-gray-200 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded text-sm transition-colors font-medium flex items-center"
                                >
                                    <Icon name="close" className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="ml-8">
                    <div
                        onClick={() => setIsEditing(true)}
                        className={`cursor-pointer rounded-md p-3 text-sm min-h-[60px] transition-colors ${
                            task.description
                                ? 'text-gray-800 hover:bg-gray-200'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-4 px-3'
                        }`}
                    >
                        {task.description ? (
                            <p className="whitespace-pre-wrap">{task.description}</p>
                        ) : (
                            'Thêm mô tả chi tiết hơn...'
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
