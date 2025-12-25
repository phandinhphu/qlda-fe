import { useRef } from 'react';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function ListMenu({ onDelete, onRename }) {
    const handleDelete = () => {
        // Hỏi xác nhận trước khi xóa
        if (window.confirm('Bạn có chắc muốn xóa danh sách này? (Tất cả thẻ bên trong cũng sẽ bị xóa)')) {
            onDelete();
        }
    };

    return (
        <div className="w-60 bg-white text-gray-700 rounded-lg shadow-xl border border-gray-200 p-2">
            {' '}
            <ul className="space-y-1">
                <li onClick={onRename} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                    <Icon name="edit" className="mr-2 text-lg" />
                    <span>Đổi tên danh sách...</span>
                </li>
                {/* Nút Xóa */}{' '}
                <li
                    onClick={handleDelete} // SỬA ĐỔI: Giữ nguyên hover màu đỏ
                    className="flex items-center p-2 rounded-md hover:bg-red-500 hover:text-white cursor-pointer"
                >
                    <Icon name="delete_outline" className="mr-2 text-lg" /> <span>Xóa danh sách này...</span>{' '}
                </li>
            </ul>
        </div>
    );
}
