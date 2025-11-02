import { useState } from 'react';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function AddListForm({ onSaveList }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (title.trim() === '') return;
        onSaveList(title); // Gọi hàm từ component cha (pages/board.js)
        setTitle('');
        setIsEditing(false);
    };

    // Trạng thái nút "Thêm danh sách khác"
    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="flex-shrink-0 w-[300px] h-12 flex items-center p-4 bg-white/10 hover:bg-white/20 text-gray-200 rounded-xl transition-colors"
            >
                <Icon name="add" className="mr-2" />
                Thêm danh sách khác
            </button>
        );
    }

    // Trạng thái form nhập liệu
    return (
        <div className="flex-shrink-0 w-[300px] bg-[#2b2b2b] rounded-xl p-3 shadow-lg">
            <input
                type="text"
                placeholder="Nhập tiêu đề danh sách..."
                className="w-full bg-[#4a4a4a] text-gray-200 p-2.5 rounded-md border border-[#555] focus:outline-none focus:border-gray-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Thêm bằng Enter
            />
            <div className="flex items-center mt-2.5">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3.5 rounded-md text-sm transition-colors"
                >
                    Lưu danh sách
                </button>
                <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:bg-[#4a4a4a] p-1.5 rounded-md ml-2 transition-colors"
                >
                    <Icon name="close" className="text-xl" />
                </button>
            </div>
        </div>
    );
}
