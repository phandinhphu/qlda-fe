import { useState, useRef, useEffect } from 'react';
import TaskMenu from './TaskMenu';
import TaskCheckbox from './TaskCheckBox';

export default function TaskCard({ title, onClick, onEdit, onDelete, status, onToggleStatus }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const inputRef = useRef(null);

    const completed = status === 'done';

    useEffect(() => {
        if (isEditing && inputRef.current) inputRef.current.focus();
    }, [isEditing]);

    const handleSave = () => {
        const trimmed = editedTitle.trim();
        if (trimmed === '') return;
        setIsEditing(false);
        if (trimmed !== title) onEdit(trimmed);
    };

    return (
        <div
            onClick={!isEditing ? onClick : undefined}
            className="relative bg-[#363636] hover:bg-[#4a4a4a] p-3 rounded-lg mb-2 cursor-pointer shadow-sm transition-colors"
        >
            {/* Hàng ngang chứa checkbox + tiêu đề */}
            <div className="flex items-center">
                {/* Checkbox ở đầu dòng */}
                <TaskCheckbox
                    checked={status === 'done' ? true : false}
                    onChange={(checked) => onToggleStatus(checked ? 'done' : 'todo')}
                />

                {/* Tiêu đề hoặc input chỉnh sửa */}
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') {
                                setEditedTitle(title);
                                setIsEditing(false);
                            }
                        }}
                        className="flex-1 bg-[#4a4a4a] text-gray-200 p-1.5 rounded-md focus:outline-none border border-gray-600 focus:border-gray-400 text-sm"
                    />
                ) : (
                    <p
                        className={`flex-1 text-sm break-words ${
                            completed ? 'text-gray-500 line-through' : 'text-gray-200'
                        }`}
                    >
                        {title}
                    </p>
                )}

                {/* Menu ba chấm ở cuối dòng */}
                <TaskMenu onEdit={() => setIsEditing(true)} onDelete={onDelete} />
            </div>
        </div>
    );
}
