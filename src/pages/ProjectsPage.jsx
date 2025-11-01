import { useMemo, useState } from 'react';
import ProjectList from '../components/projects/ProjectList';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectForm from '../components/projects/ProjectForm';
import { useProjects } from '../hooks/useProjects';
import styles from './ProjectsPage.module.css';

const emptyModalState = { type: null, project: null };

const ProjectsPage = () => {
    const [modalState, setModalState] = useState(emptyModalState);
    const { projects, loading, error, saving, deletingId, refresh, createProject, updateProject, deleteProject } =
        useProjects();

    const selectedProject = modalState.project;

    const modalConfig = useMemo(() => {
        switch (modalState.type) {
            case 'create':
                return { title: 'Tạo dự án mới', width: '560px' };
            case 'edit':
                return {
                    title: selectedProject?.project_name
                        ? `Chỉnh sửa: ${selectedProject.project_name}`
                        : 'Chỉnh sửa dự án',
                    width: '560px',
                };
            case 'delete':
                return { title: 'Xác nhận xóa dự án', width: '420px' };
            default:
                return { title: '', width: '520px' };
        }
    }, [modalState.type, selectedProject?.project_name]);

    const closeModal = () => setModalState(emptyModalState);

    const handleCreateClick = () => setModalState({ type: 'create', project: null });
    const handleEditClick = (project) => setModalState({ type: 'edit', project });
    const handleDeleteClick = (project) => setModalState({ type: 'delete', project });

    const handleSubmit = async (payload) => {
        if (modalState.type === 'create') {
            await createProject(payload);
        } else if (modalState.type === 'edit' && selectedProject?._id) {
            await updateProject(selectedProject._id, payload);
        }
        closeModal();
    };

    const handleConfirmDelete = async () => {
        if (!selectedProject?._id) return;
        await deleteProject(selectedProject._id);
        closeModal();
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <span className={styles.eyebrow}>Bảng điều khiển</span>
                        <h1>Quản lý kế hoạch dự án</h1>
                        <p>
                            Theo dõi các dự án của bạn, cập nhật tiến độ nhanh chóng và cộng tác cùng đội ngũ một cách
                            trực quan.
                        </p>
                    </div>
                    <button type="button" className={styles.primaryButton} onClick={handleCreateClick}>
                        + Tạo dự án mới
                    </button>
                </header>

                <ProjectList
                    projects={projects}
                    loading={loading}
                    error={error}
                    onRetry={refresh}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    saving={saving}
                    deletingId={deletingId}
                />
            </div>

            <ProjectModal
                isOpen={Boolean(modalState.type)}
                title={modalConfig.title}
                onClose={closeModal}
                width={modalConfig.width}
                footer={
                    modalState.type === 'delete' ? (
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.secondaryButton}
                                onClick={closeModal}
                                disabled={deletingId === selectedProject?._id}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                className={`${styles.primaryButton} ${styles.dangerButton}`}
                                onClick={handleConfirmDelete}
                                disabled={deletingId === selectedProject?._id}
                            >
                                {deletingId === selectedProject?._id ? 'Đang xóa...' : 'Xác nhận xóa'}
                            </button>
                        </div>
                    ) : null
                }
            >
                {modalState.type === 'delete' ? (
                    <div className={styles.confirmContent}>
                        <p>
                            Bạn có chắc muốn xóa dự án <strong>{selectedProject?.project_name || 'này'}</strong>?
                        </p>
                        <span>Hành động này sẽ xóa dự án khỏi danh sách quản lý.</span>
                    </div>
                ) : (
                    <ProjectForm
                        mode={modalState.type === 'edit' ? 'edit' : 'create'}
                        initialValues={{
                            project_name: selectedProject?.project_name || '',
                            description: selectedProject?.description || '',
                        }}
                        onSubmit={handleSubmit}
                        onCancel={closeModal}
                        isSubmitting={saving}
                    />
                )}
            </ProjectModal>
        </div>
    );
};

export default ProjectsPage;
