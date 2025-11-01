import { useEffect, useState } from 'react';
import styles from './ProjectForm.module.css';

const defaultValues = {
    project_name: '',
    description: '',
};

const ProjectForm = ({ mode = 'create', initialValues = defaultValues, onSubmit, onCancel, isSubmitting = false }) => {
    const [formValues, setFormValues] = useState(defaultValues);
    const [errors, setErrors] = useState({});

    const primaryActionLabel = mode === 'edit' ? 'Lưu thay đổi' : 'Tạo dự án';

    useEffect(() => {
        setFormValues({
            project_name: initialValues.project_name || '',
            description: initialValues.description || '',
        });
        setErrors({});
    }, [initialValues]);

    const validate = (values) => {
        const validationErrors = {};
        const trimmedName = values.project_name.trim();

        if (!trimmedName) {
            validationErrors.project_name = 'Tên dự án là bắt buộc.';
        } else if (trimmedName.length < 3) {
            validationErrors.project_name = 'Tên dự án phải có ít nhất 3 ký tự.';
        } else if (trimmedName.length > 100) {
            validationErrors.project_name = 'Tên dự án không được vượt quá 100 ký tự.';
        }

        const trimmedDescription = values.description.trim();
        if (trimmedDescription.length > 500) {
            validationErrors.description = 'Mô tả không được vượt quá 500 ký tự.';
        }

        return validationErrors;
    };

    const handleChange = (field) => (event) => {
        const { value } = event.target;
        setFormValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleBlur = () => {
        setErrors(validate(formValues));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate(formValues);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = {
            project_name: formValues.project_name.trim(),
            description: formValues.description.trim() ? formValues.description.trim() : undefined,
        };

        await onSubmit?.(payload);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.header}>
                <p>
                    {mode === 'edit'
                        ? 'Điều chỉnh thông tin dự án. Thay đổi sẽ áp dụng ngay sau khi lưu.'
                        : 'Nhập chi tiết dự án để bắt đầu quản lý công việc cùng đội nhóm.'}
                </p>
            </div>

            <div className={styles.field}>
                <label htmlFor="project-name">Tên dự án *</label>
                <input
                    id="project-name"
                    type="text"
                    placeholder="Nhập tên dự án"
                    value={formValues.project_name}
                    onChange={handleChange('project_name')}
                    onBlur={handleBlur}
                    maxLength={100}
                    required
                    autoFocus
                />
                <div className={styles.fieldMeta}>
                    <span>{formValues.project_name.trim().length} / 100</span>
                    {errors.project_name ? <span className={styles.error}>{errors.project_name}</span> : null}
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="project-description">Mô tả</label>
                <textarea
                    id="project-description"
                    placeholder="Mô tả ngắn gọn về dự án"
                    value={formValues.description}
                    onChange={handleChange('description')}
                    onBlur={handleBlur}
                    maxLength={500}
                    rows={5}
                />
                <div className={styles.fieldMeta}>
                    <span>{formValues.description.trim().length} / 500</span>
                    {errors.description ? <span className={styles.error}>{errors.description}</span> : null}
                </div>
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={onCancel} disabled={isSubmitting}>
                    Hủy
                </button>
                <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang lưu...' : primaryActionLabel}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;
