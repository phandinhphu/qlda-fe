import { useState, useEffect } from 'react';

const ProjectForm = ({ project, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        project_name: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (project) {
            setFormData({
                project_name: project.project_name || '',
                description: project.description || '',
            });
        }
    }, [project]);

    const validate = () => {
        const newErrors = {};

        if (!formData.project_name.trim()) {
            newErrors.project_name = 'Tên dự án là bắt buộc';
        } else if (formData.project_name.trim().length < 3) {
            newErrors.project_name = 'Tên dự án phải có ít nhất 3 ký tự';
        } else if (formData.project_name.trim().length > 100) {
            newErrors.project_name = 'Tên dự án không được vượt quá 100 ký tự';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tên dự án */}
            <div>
                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên dự án <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="project_name"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.project_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập tên dự án"
                    maxLength={100}
                />
                {errors.project_name && <p className="mt-1 text-sm text-red-500">{errors.project_name}</p>}
            </div>

            {/* Mô tả */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nhập mô tả dự án (tùy chọn)"
                    maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/500 ký tự</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading && (
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    )}
                    {project ? 'Cập nhật' : 'Tạo mới'}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
