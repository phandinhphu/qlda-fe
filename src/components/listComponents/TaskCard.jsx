import { useState, useRef, useEffect } from 'react';
import TaskMenu from './TaskMenu';
import TaskCheckbox from './TaskCheckBox';

export default function TaskCard({
    title,
    onClick,
    onEdit,
    onDelete,
    status,
    onToggleStatus,
    labels = [],
    members = [],
}) {
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
            className="relative bg-white hover:bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer shadow-sm border border-gray-200 transition-colors"
        >
            <div className="flex items-center">
                <TaskCheckbox checked={completed} onChange={(checked) => onToggleStatus(checked ? 'done' : 'todo')} />

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
                        className="flex-1 bg-gray-50 text-gray-800 p-1.5 rounded-md focus:outline-none border border-gray-300 focus:border-gray-400 text-sm"
                    />
                ) : (
                    <p
                        className={`flex-1 text-sm break-words ${
                            completed ? 'text-gray-400 line-through' : 'text-gray-800'
                        }`}
                    >
                        {title}
                    </p>
                )}

                <TaskMenu onEdit={() => setIsEditing(true)} onDelete={onDelete} />
            </div>

            {/* Hiển thị labels */}
            {labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {labels.map((label) => (
                        <span
                            key={label._id}
                            className="px-2 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: label.color }}
                            title={label.label_name}
                        >
                            {label.label_name}
                        </span>
                    ))}
                </div>
            )}

            {/* Hiển thị members */}
            {members.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {members.map((member) => {
                        const avatarUrl =
                            member.avatar_url ||
                            member.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'U')}&background=random`;
                        const memberName = member.name || member.email || 'Unknown';
                        return (
                            <div key={member._id} className="relative group">
                                <img
                                    src={avatarUrl}
                                    alt={memberName}
                                    className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                    title={memberName}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {memberName}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                        <div className="border-4 border-transparent border-t-gray-900"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
