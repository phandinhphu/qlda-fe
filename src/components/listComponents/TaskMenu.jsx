import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function TaskMenu({ onEdit, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    // Xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check nếu click outside menu (menuRef) VÀ outside button (buttonRef)
            // Lưu ý: buttonRef nằm trong DOM chính, menuRef nằm trong Portal
            if (
                menuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };

        // Dùng mousedown để bắt sự kiện sớm
        document.addEventListener('mousedown', handleClickOutside);
        // Cần lắng nghe scroll để đóng menu nếu user scroll (tránh menu trôi lơ lửng)
        window.addEventListener('scroll', () => setMenuOpen(false), true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', () => setMenuOpen(false), true);
        };
    }, [menuOpen]);

    const handleToggle = (e) => {
        e.stopPropagation(); // Ngăn click lan ra Card (gây mở modal)

        if (!menuOpen) {
            // Tính toán vị trí trước khi mở
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4, // Cách đáy button 4px
                left: rect.right, // Neo vào cạnh phải
            });
            setMenuOpen(true);
        } else {
            setMenuOpen(false);
        }
    };

    return (
        <div className="absolute top-1 right-1" onClick={(e) => e.stopPropagation()}>
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 p-1 rounded-md transition-colors shadow-sm border border-gray-200"
            >
                <span className="material-icons text-sm">more_horiz</span>
            </button>

            {menuOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            top: position.top,
                            left: position.left,
                            transform: 'translateX(-100%)', // Dịch sang trái 100% để căn phải
                        }}
                        className="
                        fixed w-28 
                        bg-white 
                        rounded-md shadow-xl z-[9999] border border-gray-200
                    "
                        onClick={(e) => e.stopPropagation()}
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
                            rounded-t-md
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
                            rounded-b-md
                        "
                        >
                            🗑️ Xóa
                        </button>
                    </div>,
                    document.body,
                )}
        </div>
    );
}
