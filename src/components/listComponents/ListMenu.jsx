import { useRef } from 'react';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function ListMenu({ onDelete }) {
    const handleDelete = () => {
        // Hỏi xác nhận trước khi xóa
        if (window.confirm('Bạn có chắc muốn xóa danh sách này? (Tất cả thẻ bên trong cũng sẽ bị xóa)')) {
            onDelete();
        }
    };

    return (
        // SỬA ĐỔI: Đổi nền, chữ, và viền
        <div className="absolute top-12 right-4 w-60 bg-white text-gray-700 rounded-lg shadow-xl z-10 p-2 border border-gray-200">
            {' '}
            <ul className="space-y-1">
                {/* Nút Xóa */}{' '}
                <li
                    onClick={handleDelete} // SỬA ĐỔI: Giữ nguyên hover màu đỏ
                    className="flex items-center p-2 rounded-md hover:bg-red-500 hover:text-white cursor-pointer"
                >
                    <Icon name="delete_outline" className="mr-2 text-lg" /> <span>Xóa danh sách này...</span>{' '}
                </li>
                {/* (Bạn có thể thêm các mục menu khác ở đây) */}{' '}
                <li className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Icon name="content_copy" className="mr-2 text-lg" /> <span>Nhân bản danh sách...</span>{' '}
                </li>{' '}
            </ul>{' '}
        </div>
    );
}
