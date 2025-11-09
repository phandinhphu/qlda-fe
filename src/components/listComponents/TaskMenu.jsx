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
                className="bg-gray-300 text-black-800 hover:bg-gray-500 text-sm p-1 rounded-md"
            >
                ⋮
            </button>

            {menuOpen && (
                <div
                    className="
                        absolute right-0 mt-1 w-28 
                        bg-gray-200 
                        rounded-md shadow-xl z-50 border border-gray-700
                    "
                >
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            onEdit?.();
                        }}
                        className="
                            bg-gray-200 
                            block w-full text-left px-3 py-1.5 text-sm
                            hover:bg-green-500
                            text-black-800
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
                            text-black-800
                            bg-gray-200
                            block w-full text-left px-3 py-1.5 text-sm
                            hover:bg-red-500 hover:text-white
                        "
                    >
                        🗑️ Xóa
                    </button>
                </div>
            )}
        </div>
    );
}
