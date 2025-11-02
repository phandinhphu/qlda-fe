import React from 'react';
import { Link } from 'react-router-dom';

// Component Icon (để dễ dàng sử dụng)
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function DropdownMenu({ onLogout }) {
    return (
        // Định vị menu tuyệt đối (absolute) so với cha (relative)
        <div className="absolute top-14 right-0 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <ul className="py-1">
                {/* Mục "Hồ sơ" */}
                <li>
                    <Link
                        to="/profile" // Cập nhật link tới trang hồ sơ của bạn
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors hover:text-blue-600 "
                    >
                        <Icon name="person_outline" className="mr-3" />
                        Hồ sơ
                    </Link>
                </li>

                {/* Mục "Đăng xuất" */}
                <li>
                    <button
                        onClick={onLogout}
                        className="flex bg-white items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors hover:text-blue-600 hover:border-0"
                    >
                        <Icon name="logout" className="mr-3" />
                        Đăng xuất
                    </button>
                </li>
            </ul>
        </div>
    );
}
