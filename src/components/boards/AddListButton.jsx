import { useState } from 'react';
import { Plus } from 'lucide-react';

const AddListButton = ({ onAdd, isLoading = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAdd({ name: name.trim() });
            setName('');
            setIsExpanded(false);
        } catch (error) {
            console.error('Error adding list:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setName('');
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                disabled={isLoading}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2 font-medium min-w-[280px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Plus className="w-5 h-5" />
                <span>Thêm list mới</span>
            </button>
        );
    }

    return (
        <div className="bg-gray-100 rounded-lg p-3 min-w-[280px]">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên list..."
                    autoFocus
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    disabled={isSubmitting}
                />
                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        disabled={!name.trim() || isSubmitting}
                        className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Đang thêm...' : 'Thêm list'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddListButton;
