import { useState } from 'react';
import { updateTask } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalHeader({ task, onClose, onUpdate }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(task.title);

    const handleSaveTitle = async () => {
        if (title.trim() === '' || title === task.title) {
            setIsEditingTitle(false);
            return;
        }

        try {
            const updatedTask = await updateTask(task._id, { title });
            onUpdate(updatedTask);
            setIsEditingTitle(false);
        } catch (error) {
            console.error('Error updating title:', error);
            alert(error.message);
        }
    };

    return (
        <div className="bg-white border-b border-gray-200 p-4 flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
                <Icon name="check_box" className="text-gray-600 text-2xl mt-1" />
                <div className="flex-1">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                                if (e.key === 'Escape') {
                                    setTitle(task.title);
                                    setIsEditingTitle(false);
                                }
                            }}
                            className="w-full text-xl font-semibold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                    ) : (
                        <h2
                            className="text-xl font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -ml-2"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {task.title}
                        </h2>
                    )}
                    <p className="text-sm text-gray-500 mt-1 px-2">
                        trong danh sách <span className="font-medium">{task.list_id?.title || 'N/A'}</span>
                    </p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
                <Icon name="close" className="text-2xl" />
            </button>
        </div>
    );
}
