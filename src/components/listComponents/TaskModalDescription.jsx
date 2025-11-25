import { useState } from 'react';
import { updateTask } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalDescription({ task, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(task.description || '');

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
        <div className="bg-white rounded p-4">
            <div className="flex items-center gap-2 mb-3">
                <Icon name="subject" className="text-gray-700" />
                <h3 className="font-semibold text-gray-800">Mô tả</h3>
            </div>

            {isEditing ? (
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Thêm mô tả chi tiết hơn..."
                        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-400 min-h-24 text-sm bg-white"
                        autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={() => {
                                setDescription(task.description || '');
                                setIsEditing(false);
                            }}
                            className="text-gray-700 px-4 py-2 rounded text-sm transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer hover:bg-gray-50 rounded p-3 text-sm text-gray-700 min-h-20 border border-gray-300"
                >
                    {task.description || 'Thêm mô tả chi tiết hơn...'}
                </div>
            )}
        </div>
    );
}
