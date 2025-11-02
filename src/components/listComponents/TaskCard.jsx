export default function TaskCard({ title, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-[#363636] hover:bg-[#4a4a4a] p-3 rounded-lg mb-2 cursor-pointer shadow-sm transition-colors"
        >
            <p className="text-sm text-gray-200 break-words">{title}</p>
        </div>
    );
}
