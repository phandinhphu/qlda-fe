const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden group">
            {/* Card Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                    {project.project_name}
                </h3>
                {project.description && <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>}
            </div>

            {/* Card Footer */}
            <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span>{formatDate(project.created_at)}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onView && onView(project)}
                        className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        Xem
                    </button>
                    <button
                        onClick={() => onEdit && onEdit(project)}
                        className="flex-1 px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Sửa
                    </button>
                    <button
                        onClick={() => onDelete && onDelete(project)}
                        className="flex-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
