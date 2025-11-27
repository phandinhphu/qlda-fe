import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import ProjectList from '../components/projects/ProjectList';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectForm from '../components/projects/ProjectForm';
import { useAuth } from '../hooks/auth';
import Toast from '../components/Toast';
import * as projectService from '../services/projectServices';

const ProjectsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isFormLoading, setIsFormLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const searchQuery = (searchParams.get('q') || '').trim().toLowerCase();

    // Fetch projects
    const fetchProjects = useCallback(async () => {
        if (user && user._id) {
            try {
                setIsLoading(true);
                // 4. SỬA CÁCH GỌI API
                const data = await projectService.getProjectsByUser(user._id);
                setProjects(data);
                setError(null); // Xóa lỗi cũ nếu thành công
            } catch (err) {
                setError(err.message); // Gọi setError (đã tồn tại)
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Nếu không có user (ví dụ: đang tải user), không làm gì
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Chỉ chạy khi user đã được load
        if (user) {
            fetchProjects();
        }
    }, [fetchProjects, user]);

    const visibleProjects = searchQuery
        ? projects.filter((p) => p?.project_name?.toLowerCase().includes(searchQuery))
        : projects;

    // Toast helper
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Modal handlers
    const handleOpenCreateModal = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const handleOpenDeleteModal = (project) => {
        setSelectedProject(project);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProject(null);
    };

    // Form submit
    const handleFormSubmit = async (formData) => {
        try {
            setIsFormLoading(true);
            if (selectedProject) {
                // Update
                await projectService.updateProject(selectedProject._id, formData);
                showToast('Cập nhật dự án thành công', 'success');
            } else {
                // Create
                await projectService.createProject(formData);
                showToast('Tạo dự án thành công', 'success');
            }
            handleCloseModal();
            fetchProjects();
        } catch (error) {
            showToast(error.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setIsFormLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async () => {
        if (!selectedProject) return;

        try {
            setIsFormLoading(true);
            await projectService.deleteProject(selectedProject._id);
            showToast('Xóa dự án thành công', 'success');
            handleCloseDeleteModal();
            fetchProjects();
        } catch (error) {
            showToast(error.message || 'Có lỗi xảy ra khi xóa dự án', 'error');
        } finally {
            setIsFormLoading(false);
        }
    };

    // View handler - Navigate to board page
    const handleView = (project) => {
        navigate(`/projects/${project._id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý Dự án</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                {`Tổng số: ${visibleProjects.length}${searchQuery ? ` / ${projects.length}` : ''} dự án`}
                            </p>
                        </div>
                        <button
                            onClick={handleOpenCreateModal}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Tạo dự án mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ProjectList
                    projects={visibleProjects}
                    isLoading={isLoading}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                    onView={handleView}
                />
            </div>

            {/* Create/Edit Modal */}
            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedProject ? 'Chỉnh sửa Dự án' : 'Tạo Dự án Mới'}
            >
                <ProjectForm
                    project={selectedProject}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    isLoading={isFormLoading}
                />
            </ProjectModal>

            {/* Delete Confirmation Modal */}
            <ProjectModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} title="Xác nhận xóa dự án">
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Bạn có chắc chắn muốn xóa dự án{' '}
                        <span className="font-semibold text-red-600">"{selectedProject?.project_name}"</span>?
                    </p>
                    <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCloseDeleteModal}
                            disabled={isFormLoading}
                            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isFormLoading}
                            className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isFormLoading && (
                                <svg
                                    className="w-5 h-5 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            )}
                            Xác nhận xóa
                        </button>
                    </div>
                </div>
            </ProjectModal>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ProjectsPage;
