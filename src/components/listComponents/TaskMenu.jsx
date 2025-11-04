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
                className="text-gray-400 hover:text-gray-200 text-sm p-1 rounded-md"
            >
                ⋮
            </button>

            {menuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-[#2c2c2c] rounded-md shadow-xl z-50 border border-gray-700">
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            onEdit?.();
                        }}
                        className="block w-full text-left px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700"
                    >
                        ✏️ Sửa
                    </button>
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            onDelete?.();
                        }}
                        className="block w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-gray-700"
                    >
                        🗑️ Xóa
                    </button>
                </div>
            )}
        </div>
    );
}
