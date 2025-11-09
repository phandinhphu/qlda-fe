import { useState } from 'react';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function AddListForm({ onSaveList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (title.trim() === '') return;
        onSaveList(title);
        setTitle('');
        setIsEditing(false);
    };

    // Trạng thái nút "Thêm danh sách khác"
    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                // SỬA ĐỔI: Đổi nền/chữ sang màu sáng
                className="flex-shrink-0 w-[300px] h-12 flex items-center p-4 bg-gray-900/5 hover:bg-gray-900/10 text-gray-700 rounded-xl transition-colors"
            >
                <Icon name="add" className="mr-2" />
                Thêm danh sách khác
            </button>
        );
    }

    // Trạng thái form nhập liệu
    return (
        <div className="max-h-35 flex-shrink-0 w-[300px] bg-gray-200 rounded-xl p-3 shadow-lg">
            <input
                type="text"
                placeholder="Nhập tiêu đề danh sách..."
                className="w-full bg-white text-gray-900 p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <div className="flex items-center mt-2.5">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3.5 rounded-md text-sm transition-colors"
                >
                    Lưu danh sách
                </button>
                <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 bg-gray-900/7 hover:bg-gray-900/10 py-1 px-2 rounded-md ml-2 transition-colors"
                >
                    <Icon name="close" className="text-xl" />
                </button>
            </div>
        </div>
    );
}
