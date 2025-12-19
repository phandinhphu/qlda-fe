import { useState, useRef, useEffect } from 'react';

export default function TaskMenu({ onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="absolute top-1 right-1" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors shadow-sm border border-gray-200"
            >
                <span className="material-icons text-sm">more_horiz</span>
            </button>

            {menuOpen && (
                <div
                    className="
                        absolute right-0 mt-1 w-28 
                        bg-white 
                        rounded-md shadow-xl z-50 border border-gray-200
                    "
                >
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            onEdit?.();
                        }}
                        className="
                            bg-white 
                            block w-full text-left px-3 py-2 text-sm
                            hover:bg-gray-100 text-gray-700
                            transition-colors
                        "
                    >
                        ✏️ Sửa
                    </button>
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            onDelete?.();
                        }}
                        className="
                            bg-white
                            block w-full text-left px-3 py-2 text-sm
                            text-red-600
                            hover:bg-red-50
                            transition-colors
                        "
                    >
                        🗑️ Xóa
                    </button>
                </div>
            )}
        </div>
    );
}
