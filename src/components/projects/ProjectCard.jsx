import styles from './ProjectCard.module.css';

const formatDate = (value) => {
    if (!value) return 'Chưa xác định';
    try {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(value));
    } catch (error) {
        return 'Chưa xác định';
    }
};

const ProjectCard = ({ project, onEdit, onDelete, disableActions = false, isDeleting = false }) => {
    const creatorName = project?.created_by?.name || 'Không rõ';
    const createdDate = formatDate(project?.created_at);

    return (
        <article className={styles.card}>
            <div className={styles.titleRow}>
                <h3 title={project.project_name}>{project.project_name}</h3>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.actionButton} ${styles.edit}`}
                        onClick={() => onEdit?.(project)}
                        disabled={disableActions || isDeleting}
                        aria-label={`Chỉnh sửa dự án ${project.project_name}`}
                    >
                        Sửa
                    </button>
                    <button
                        type="button"
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => onDelete?.(project)}
                        disabled={disableActions || isDeleting}
                        aria-label={`Xóa dự án ${project.project_name}`}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            </div>

            <p className={styles.description} title={project.description || undefined}>
                {project.description || 'Chưa có mô tả cho dự án này.'}
            </p>

            <div className={styles.meta}>
                <span>Ngày tạo: {createdDate}</span>
                <span>Người tạo: {creatorName}</span>
            </div>
        </article>
    );
};

export default ProjectCard;
