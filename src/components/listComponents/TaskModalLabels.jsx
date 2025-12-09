import { useState, useEffect } from 'react';
import { getTaskLabels, addLabel, updateLabel, deleteLabel } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

// Màu sắc mặc định cho labels
const DEFAULT_COLORS = [
    '#61BD4F', // Xanh lá
    '#F2D600', // Vàng
    '#FF9F1A', // Cam
    '#EB5A46', // Đỏ
    '#C377E0', // Tím
    '#0079BF', // Xanh dương
    '#00C2E0', // Xanh nhạt
    '#51E898', // Xanh lá nhạt
    '#FF78CB', // Hồng
    '#344563', // Xám đậm
];

export default function TaskModalLabels({ task, onUpdate, onLabelsChange }) {
    const [labels, setLabels] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingLabelId, setEditingLabelId] = useState(null);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState(DEFAULT_COLORS[0]);
    const [editLabelName, setEditLabelName] = useState('');
    const [editLabelColor, setEditLabelColor] = useState('');

    useEffect(() => {
        const fetchLabels = async () => {
            try {
                const fetchedLabels = await getTaskLabels(task._id);
                setLabels(fetchedLabels || []);
            } catch (error) {
                console.error('Error fetching labels:', error);
            }
        };

        fetchLabels();
    }, [task._id]);

    const handleAddLabel = async () => {
        if (newLabelName.trim() === '') return;

        try {
            const newLabel = await addLabel(task._id, {
                label_name: newLabelName.trim(),
                color: newLabelColor,
            });
            setLabels([...labels, newLabel]);
            setNewLabelName('');
            setNewLabelColor(DEFAULT_COLORS[0]);
            setShowAddForm(false);
            // Thông báo parent component refresh labels
            if (onLabelsChange) {
                onLabelsChange(task._id);
            }
        } catch (error) {
            console.error('Error adding label:', error);
            alert(error.message);
        }
    };

    const handleStartEdit = (label) => {
        setEditingLabelId(label._id);
        setEditLabelName(label.label_name);
        setEditLabelColor(label.color);
    };

    const handleCancelEdit = () => {
        setEditingLabelId(null);
        setEditLabelName('');
        setEditLabelColor('');
    };

    const handleUpdateLabel = async (labelId) => {
        if (editLabelName.trim() === '') return;

        try {
            const updatedLabel = await updateLabel(task._id, labelId, {
                label_name: editLabelName.trim(),
                color: editLabelColor,
            });
            setLabels(labels.map((l) => (l._id === labelId ? updatedLabel : l)));
            handleCancelEdit();
            // Thông báo parent component refresh labels
            if (onLabelsChange) {
                onLabelsChange(task._id);
            }
        } catch (error) {
            console.error('Error updating label:', error);
            alert(error.message);
        }
    };

    const handleDeleteLabel = async (labelId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa nhãn này?')) return;

        try {
            await deleteLabel(task._id, labelId);
            setLabels(labels.filter((l) => l._id !== labelId));
            // Thông báo parent component refresh labels
            if (onLabelsChange) {
                onLabelsChange(task._id);
            }
        } catch (error) {
            console.error('Error deleting label:', error);
            alert(error.message);
        }
    };

    return (
        <div className="bg-white rounded p-4">
            <div className="flex items-center gap-2 mb-3">
                <Icon name="label" className="text-gray-700" />
                <h3 className="font-semibold text-gray-800">Nhãn</h3>
            </div>

            {/* Hiển thị danh sách labels */}
            {labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {labels.map((label) => (
                        <div
                            key={label._id}
                            className="group relative flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-white min-w-[80px]"
                            style={{ backgroundColor: label.color }}
                        >
                            {editingLabelId === label._id ? (
                                <div className="absolute top-full left-0 mt-2 z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[300px]">
                                    <input
                                        type="text"
                                        value={editLabelName}
                                        onChange={(e) => setEditLabelName(e.target.value)}
                                        className="w-full bg-white text-gray-800 px-2 py-1 rounded text-sm border border-gray-300 focus:outline-none focus:border-blue-400 mb-2"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleUpdateLabel(label._id);
                                            }
                                            if (e.key === 'Escape') {
                                                handleCancelEdit();
                                            }
                                        }}
                                    />
                                    <div className="mb-2">
                                        <label className="block text-xs text-gray-600 mb-1">Chọn màu:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {DEFAULT_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setEditLabelColor(color)}
                                                    className={`w-6 h-6 rounded border-2 transition-all ${
                                                        editLabelColor === color
                                                            ? 'border-gray-800 scale-110'
                                                            : 'border-gray-300 hover:border-gray-500'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                            <input
                                                type="color"
                                                value={editLabelColor}
                                                onChange={(e) => setEditLabelColor(e.target.value)}
                                                className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                                                title="Chọn màu tùy chỉnh"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateLabel(label._id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="flex-1">{label.label_name}</span>
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                        <button
                                            onClick={() => handleStartEdit(label)}
                                            className="bg-white/20 hover:bg-white/30 p-1 rounded"
                                            title="Chỉnh sửa"
                                        >
                                            <Icon name="edit" className="text-xs" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLabel(label._id)}
                                            className="bg-white/20 hover:bg-white/30 p-1 rounded"
                                            title="Xóa"
                                        >
                                            <Icon name="delete" className="text-xs" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Form thêm label mới */}
            {showAddForm ? (
                <div className="border border-gray-300 rounded p-3 bg-gray-50">
                    <input
                        type="text"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        placeholder="Tên nhãn"
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-400 mb-2"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddLabel();
                            }
                            if (e.key === 'Escape') {
                                setNewLabelName('');
                                setShowAddForm(false);
                            }
                        }}
                    />

                    {/* Chọn màu */}
                    <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-2">Chọn màu:</label>
                        <div className="flex flex-wrap gap-2">
                            {DEFAULT_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setNewLabelColor(color)}
                                    className={`w-8 h-8 rounded border-2 transition-all ${
                                        newLabelColor === color
                                            ? 'border-gray-800 scale-110'
                                            : 'border-gray-300 hover:border-gray-500'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            <input
                                type="color"
                                value={newLabelColor}
                                onChange={(e) => setNewLabelColor(e.target.value)}
                                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                title="Chọn màu tùy chỉnh"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddLabel}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                            Thêm
                        </button>
                        <button
                            onClick={() => {
                                setNewLabelName('');
                                setShowAddForm(false);
                            }}
                            className="text-gray-700 px-4 py-2 rounded text-sm transition-colors hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full text-left text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 p-3 rounded border border-gray-300"
                >
                    + Thêm nhãn
                </button>
            )}
        </div>
    );
}
