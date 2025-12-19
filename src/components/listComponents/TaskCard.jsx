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
            className="group relative bg-white hover:bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                    <TaskCheckbox
                        checked={completed}
                        onChange={(checked) => onToggleStatus(checked ? 'done' : 'todo')}
                    />

                    {isEditing ? (
                        <textarea
                            ref={inputRef}
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSave();
                                }
                                if (e.key === 'Escape') {
                                    setEditedTitle(title);
                                    setIsEditing(false);
                                }
                            }}
                            className="w-full bg-white text-gray-800 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 text-sm resize-none"
                            rows={2}
                        />
                    ) : (
                        <p
                            className={`text-sm font-medium leading-normal break-words ${
                                completed ? 'text-gray-400 line-through' : 'text-gray-800'
                            }`}
                        >
                            {title}
                        </p>
                    )}
                </div>

                {/* Action Menu - Only visible on hover area */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <TaskMenu onEdit={() => setIsEditing(true)} onDelete={onDelete} />
                </div>
            </div>

            {/* Footer Area: Labels & Members */}
            {(labels.length > 0 || members.length > 0) && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    {/* Labels */}
                    <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                        {labels.map((label) => (
                            <span
                                key={label._id}
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm"
                                style={{ backgroundColor: label.color }}
                                title={label.label_name}
                            >
                                {label.label_name}
                            </span>
                        ))}
                    </div>

                    {/* Members - Stacked */}
                    <div className="flex items-center -space-x-2">
                        {members.map((member) => {
                            const avatarUrl =
                                member.avatar_url ||
                                member.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'U')}&background=random`;
                            const memberName = member.name || member.email || 'Unknown';
                            return (
                                <div key={member._id} className="relative group/avatar">
                                    <img
                                        src={avatarUrl}
                                        alt={memberName}
                                        className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-110 hover:z-10 transition-transform"
                                        title={memberName}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full right-0 mb-1.5 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                        {memberName}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
