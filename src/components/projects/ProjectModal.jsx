import { useEffect, useId } from 'react';
import styles from './ProjectModal.module.css';

const ProjectModal = ({ isOpen, title, onClose, children, footer, width = '520px' }) => {
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className={styles.backdrop} role="presentation" onClick={handleBackdropClick}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                style={{ maxWidth: width }}
            >
                <header className={styles.header}>
                    <h2 id={titleId}>{title}</h2>
                    <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Đóng">
                        ×
                    </button>
                </header>
                <div className={styles.content}>{children}</div>
                {footer ? <footer className={styles.footer}>{footer}</footer> : null}
            </div>
        </div>
    );
};

export default ProjectModal;
