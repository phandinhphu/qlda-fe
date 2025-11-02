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
        // 'absolute' sẽ định vị menu này so với component cha (phải là 'relative')
        // 'top-12' đặt nó ngay dưới header của cột
        // 'right-4' đặt nó ở bên phải
        <div className="absolute top-12 right-4 w-60 bg-[#363636] text-gray-200 rounded-lg shadow-xl z-10 p-2 border border-gray-700">
            <ul className="space-y-1">
                {/* Nút Xóa */}
                <li
                    onClick={handleDelete}
                    className="flex items-center p-2 rounded-md hover:bg-red-600 hover:text-white cursor-pointer"
                >
                    <Icon name="delete_outline" className="mr-2 text-lg" />
                    <span>Xóa danh sách này...</span>
                </li>

                {/* (Bạn có thể thêm các mục menu khác ở đây) */}
                <li className="flex items-center p-2 rounded-md hover:bg-[#4a4a4a] cursor-pointer">
                    <Icon name="content_copy" className="mr-2 text-lg" />
                    <span>Nhân bản danh sách...</span>
                </li>
            </ul>
        </div>
    );
}
