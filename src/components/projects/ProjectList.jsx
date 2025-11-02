import ProjectCard from './ProjectCard';
import Spinner from '../Spinner';

const ProjectList = ({ projects, isLoading, onEdit, onDelete, onView }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <svg className="w-24 h-24 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p className="text-lg font-medium">Chưa có dự án nào</p>
                <p className="text-sm">Bấm "Tạo dự án mới" để bắt đầu</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project._id} project={project} onEdit={onEdit} onDelete={onDelete} onView={onView} />
            ))}
        </div>
    );
};

export default ProjectList;
