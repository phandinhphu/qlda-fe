import { useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

const ListHeader = ({ list, onEdit, onDelete, isLoading = false }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        setShowMenu(false);
        if (onEdit) onEdit(list);
    };

    const handleDelete = () => {
        setShowMenu(false);
        if (onDelete) {
            if (window.confirm(`Bạn có chắc muốn xóa list "${list.title}"? Tất cả tasks trong list sẽ bị xóa.`)) {
                onDelete(list);
            }
        }
    };

    return (
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 flex-1 min-w-0">{list.title}</h3>
            <div className="relative flex-shrink-0" ref={menuRef}>
                <button
                    onClick={handleMenuClick}
                    disabled={isLoading}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                    type="button"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[150px]">
                        <button
                            onClick={handleEdit}
                            disabled={isLoading}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                            type="button"
                        >
                            <Edit2 className="w-4 h-4" />
                            <span>Chỉnh sửa</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                            type="button"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListHeader;
