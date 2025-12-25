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
        <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nhãn</h3>

            {/* Hiển thị danh sách labels */}
            <div className="flex flex-wrap gap-2 mb-2">
                {labels.map((label) => (
                    <div
                        key={label._id}
                        className="group relative flex items-center gap-2 px-3 py-1.5 rounded text-sm font-semibold text-white min-h-[32px] cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: label.color }}
                        onClick={() => handleStartEdit(label)}
                    >
                        {editingLabelId === label._id ? (
                            <div
                                className="absolute top-full left-0 mt-2 z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-[280px]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">Sửa nhãn</h4>
                                <input
                                    type="text"
                                    value={editLabelName}
                                    onChange={(e) => setEditLabelName(e.target.value)}
                                    className="w-full bg-white text-gray-800 px-2 py-1.5 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
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
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Chọn màu</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {DEFAULT_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setEditLabelColor(color)}
                                                className={`w-full aspect-square rounded cursor-pointer transition-transform hover:scale-105 ${
                                                    editLabelColor === color ? 'ring-2 ring-offset-1 ring-gray-600' : ''
                                                }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleUpdateLabel(label._id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        onClick={() => handleDeleteLabel(label._id)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded text-xs font-medium transition-colors"
                                    >
                                        Xóa
                                    </button>
                                </div>
                                <button
                                    onClick={handleCancelEdit}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                    <Icon name="close" className="text-base" />
                                </button>
                            </div>
                        ) : (
                            <span className="truncate max-w-[150px]">{label.label_name}</span>
                        )}
                    </div>
                ))}

                {/* Add Button */}
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded transition-colors flex items-center justify-center min-h-[32px] border border-gray-200"
                >
                    <Icon name="add" className="text-lg" />
                </button>
            </div>

            {/* Form thêm label mới - Popover style */}
            {showAddForm && (
                <div className="relative">
                    <div className="absolute top-0 left-0 z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-[280px]">
                        <div className="flex justify-between items-center mb-2 border-b pb-1">
                            <h4 className="text-sm font-semibold text-gray-700">Tạo nhãn mới</h4>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                                <Icon name="close" className="text-base" />
                            </button>
                        </div>

                        <input
                            type="text"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            placeholder="Tên nhãn"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
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
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Chọn màu</label>
                            <div className="grid grid-cols-5 gap-2">
                                {DEFAULT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNewLabelColor(color)}
                                        className={`w-full aspect-square rounded cursor-pointer transition-transform hover:scale-105 ${
                                            newLabelColor === color ? 'ring-2 ring-offset-1 ring-gray-600' : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddLabel}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-sm font-medium transition-colors"
                        >
                            Tạo mới
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
