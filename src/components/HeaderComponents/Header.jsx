import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import DropdownMenu from './DropDownMenu';
import { Link } from 'react-router-dom';
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Nếu menu đang mở VÀ click không nằm trong 'menuRef'
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Đóng menu
            }
        };
        // Thêm listener vào document
        document.addEventListener('mousedown', handleClickOutside);
        // Dọn dẹp listener khi component bị gỡ
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchText.trim();
        if (query.length === 0) {
            navigate('/projects');
        } else {
            navigate(`/projects?q=${encodeURIComponent(query)}`);
        }
    };

    const handleLogout = async () => {
        setIsMenuOpen(false); // Đóng menu trước
        try {
            await logout(); // Gọi hàm logout từ auth context
            navigate('/login'); // Chuyển về trang login
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
        }
    };
    return (
        <header className="flex items-center justify-between w-full px-6 h-22 bg-white border-b border-gray-200 sticky top-0 z-40">
            {/* 1. Logo (Left) */}
            <div className="flex items-center gap-3 w-64">
                <div className="bg-blue-600 rounded-lg p-1.5 shadow-sm text-white">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9.17 15H11v4.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2V4.1c1.89.96 3.13 3.01 3.13 5.4 0 2.7-1.4 5.01-3.47 6.39z" />
                    </svg>
                </div>
                <Link to="/projects" className="flex items-center text-decoration-none">
                    <span className="text-xl font-bold text-gray-800 tracking-tight">QLDuAn</span>
                </Link>
            </div>

            {/* 2. Search Bar (Center) */}
            <div className="flex-1 max-w-2xl px-4">
                <form onSubmit={handleSearchSubmit} className="relative w-full group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon
                            name="search"
                            className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                        />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm dự án..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full py-2 pl-10 pr-4 text-sm bg-gray-100 border-transparent text-gray-700 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
                    />
                </form>
            </div>

            {/* 3. User & Actions (Right) */}
            <div className="flex items-center justify-end gap-3 w-64">
                {/* Notification Button */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                    <Icon name="notifications" className="text-xl" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                {/* User Menu Trigger */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className={`flex items-center gap-2 p-1 pl-3 pr-2 rounded-full transition-all border shadow-sm ${
                            isMenuOpen
                                ? 'bg-white border-blue-200 ring-2 ring-blue-50'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className="text-sm font-semibold text-gray-700 hidden md:block">{user.name}</div>
                        <img
                            className="w-8 h-8 rounded-full object-cover border border-gray-100"
                            src={user.avatar_url || 'https://i.pravatar.cc/150?u=user'}
                            alt="avatar"
                        />
                        <Icon
                            name="expand_more"
                            className={`text-gray-400 text-lg transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-1 w-56 z-50 animate-slide-up-fade origin-top-right">
                            <DropdownMenu onLogout={handleLogout} />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
