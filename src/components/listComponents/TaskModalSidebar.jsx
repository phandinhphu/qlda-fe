const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalSidebar() {
    const sidebarItems = [
        { icon: 'person_add', label: 'Thành viên', onClick: () => console.log('Add member') },
        { icon: 'label', label: 'Nhãn', onClick: () => console.log('Add label') },
        { icon: 'event', label: 'Ngày', onClick: () => console.log('Add date') },
        { icon: 'checklist', label: 'Việc cần làm', onClick: () => console.log('Add checklist') },
    ];

    return (
        <div className="w-48 shrink-0 space-y-2">
            <h4 className="text-xs font-semibold text-gray-600 uppercase mb-3">Thêm vào thẻ</h4>
            {sidebarItems.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm transition-colors"
                >
                    <Icon name={item.icon} className="text-base" />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
}
