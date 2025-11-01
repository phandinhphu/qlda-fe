import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { projectService } from '../services/projectService';

const extractData = (response) => response?.data?.data;

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await projectService.getAll();
            const projectList = Array.isArray(extractData(response)) ? extractData(response) : [];
            setProjects(projectList);
            setError(null);
        } catch (err) {
            const message = err.message || 'Không thể tải danh sách dự án.';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = useCallback(async (payload) => {
        setSaving(true);
        try {
            const response = await projectService.create(payload);
            const createdProject = extractData(response);
            if (createdProject) {
                setProjects((prev) => [createdProject, ...prev]);
            }
            const message = response?.data?.message || 'Tạo dự án thành công.';
            toast.success(message);
            return createdProject;
        } catch (err) {
            const message = err.message || 'Không thể tạo dự án.';
            toast.error(message);
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    const updateProject = useCallback(async (projectId, payload) => {
        setSaving(true);
        try {
            const response = await projectService.update(projectId, payload);
            const updatedProject = extractData(response);
            if (updatedProject) {
                setProjects((prev) => prev.map((project) => (project._id === projectId ? updatedProject : project)));
            }
            const message = response?.data?.message || 'Cập nhật dự án thành công.';
            toast.success(message);
            return updatedProject;
        } catch (err) {
            const message = err.message || 'Không thể cập nhật dự án.';
            toast.error(message);
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    const deleteProject = useCallback(async (projectId) => {
        setDeletingId(projectId);
        try {
            const response = await projectService.delete(projectId);
            setProjects((prev) => prev.filter((project) => project._id !== projectId));
            const message = response?.data?.message || 'Xóa dự án thành công.';
            toast.success(message);
        } catch (err) {
            const message = err.message || 'Không thể xóa dự án.';
            toast.error(message);
            throw err;
        } finally {
            setDeletingId(null);
        }
    }, []);

    return {
        projects,
        loading,
        error,
        saving,
        deletingId,
        refresh: fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
};

export default useProjects;
