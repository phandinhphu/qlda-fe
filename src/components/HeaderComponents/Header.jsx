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
        <header className="flex items-center justify-between w-full px-6 py-3 bg-white border-b border-gray-200">
            {/* 1. Logo (Bên trái) */}
            <div className="flex items-center">
                {/* Bạn có thể thay SVG này bằng logo .png của mình */}
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9.17 15H11v4.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2V4.1c1.89.96 3.13 3.01 3.13 5.4 0 2.7-1.4 5.01-3.47 6.39z" />
                </svg>
                <Link to="/projects" className="flex items-center ml-2 text-decoration-none">
                    <span className="ml-2 text-xl font-bold text-gray-800">QLDuAn</span>
                </Link>
            </div>

            {/* 2. Thanh tìm kiếm (Giữa) */}
            <form onSubmit={handleSearchSubmit} className="relative w-1/3 max-w-lg">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon name="search" className="text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Tìm kiếm dự án theo tên..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="text-gray-400 w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </form>

            {/* 3. Thông tin User (Bên phải) */}
            <div className="flex items-center space-x-4">
                {/* Nút chuông thông báo */}
                <button className="text-gray-400 hover:text-gray-900 hover:border-none relative bg-white focus:border-none focus:bg-gray-100 transition-colors">
                    <Icon name="notifications" className="text-2xl" />
                    {/* (Tùy chọn) Chấm đỏ thông báo mới */}
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Khối thông tin User */}
                <div className="relative" ref={menuRef}>
                    {/* Đổi khối avatar thành 'button' để có thể click */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle menu
                        className="flex items-center space-x-3 cursor-pointer bg-white hover:bg-gray-100 hover:border-0 p-2 rounded-lg transition-colors focus:bg-gray-200 focus:outline-none"
                    >
                        {/* Tên và Địa điểm */}
                        <div className="text-right">
                            <div className="text-sm font-semibold text-black">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.location}</div>
                        </div>
                        {/* Avatar */}
                        <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={user.avatar_url || 'https://i.pravatar.cc/150?u=user'}
                            alt="User Avatar"
                        />
                    </button>

                    {/* 7. Render menu nếu 'isMenuOpen' là true */}
                    {isMenuOpen && <DropdownMenu onLogout={handleLogout} />}
                </div>
            </div>
        </header>
    );
}
