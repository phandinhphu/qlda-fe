import ProjectCard from './ProjectCard';
import styles from './ProjectList.module.css';

const SkeletonCard = () => (
    <div className={styles.skeletonCard} aria-hidden>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonText} />
        <div className={styles.skeletonFooter} />
    </div>
);

const ProjectList = ({ projects, loading, error, onRetry, onEdit, onDelete, saving, deletingId }) => {
    const hasProjects = projects?.length > 0;

    return (
        <section className={styles.wrapper}>
            {error ? (
                <div className={styles.errorBanner} role="alert">
                    <span>{error}</span>
                    {onRetry ? (
                        <button type="button" onClick={onRetry}>
                            Thử lại
                        </button>
                    ) : null}
                </div>
            ) : null}

            {loading ? (
                <div className={styles.grid}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : hasProjects ? (
                <div className={styles.grid}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            disableActions={saving}
                            isDeleting={deletingId === project._id}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h3>Chưa có dự án nào</h3>
                    <p>Hãy bắt đầu bằng cách tạo dự án đầu tiên để quản lý công việc hiệu quả.</p>
                </div>
            )}
        </section>
    );
};

export default ProjectList;
