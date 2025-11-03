export default function TaskCard({ title, onClick }) {
    return (
        <div
            onClick={onClick} // SỬA ĐỔI: Đổi nền, hover, và thêm viền
            className="bg-white hover:bg-gray-50 p-3 rounded-lg mb-2 cursor-pointer shadow-sm transition-colors border border-gray-200"
        >
                        {/* SỬA ĐỔI: Đổi màu chữ sang đen */}           {' '}
            <p className="text-sm text-gray-900 break-words">{title}</p>       {' '}
        </div>
    );
}
