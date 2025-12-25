import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/auth';
import { getProjectsByUser, getMyProjectsWithStats } from '../services/projectServices';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import WorkDoneCard from '../components/profileComponents/WorkDoneCard';
import ProjectProgressCard from '../components/profileComponents/ProjectProgressCard';
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

const ProjectMiniCard = ({ project }) => (
    <div className="text-center">
        <img
            src={project.thumbnail_url || 'https://picsum.photos/200/200?grayscale&blur=1'}
            alt={project.project_name}
            className="w-full h-20 object-cover rounded-lg shadow-sm border border-gray-200"
        />
        <p className="mt-2 text-xs font-medium text-gray-700 truncate">{project.project_name}</p>
    </div>
);

export default function ProfilePage() {
    const { user } = useAuth(); // Lấy thông tin user hiện tại
    const [userProjects, setUserProjects] = useState([]); //project user tạo
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCompleted, setShowCompleted] = useState(false);
    const [projectsWithStats, setProjectsWithStats] = useState([]); //project user tham gia

    const { incompleteProjects, completedProjects } = useMemo(() => {
        const incomplete = [];
        const completed = [];

        if (Array.isArray(projectsWithStats)) {
            for (const project of projectsWithStats) {
                if (project.percentage === 100) {
                    completed.push(project);
                } else {
                    incomplete.push(project);
                }
            }
        }

        return { incompleteProjects: incomplete, completedProjects: completed };
    }, [projectsWithStats]);

    useEffect(() => {
        if (user && user._id) {
            const fetchAllData = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const [projectsData, statsData] = await Promise.all([
                        getProjectsByUser(user._id),
                        getMyProjectsWithStats(),
                    ]);

                    setUserProjects(projectsData || []);
                    setProjectsWithStats(statsData || []);
                } catch (err) {
                    console.error('Lỗi khi tải dữ liệu trang:', err);
                    setError(err.message);
                    setUserProjects([]);
                    setProjectsWithStats([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllData();
        }
    }, [user]);

    // --- Xử lý trạng thái Loading ---
    if (loading || !user) {
        return (
            <div className="flex justify-center items-center p-8 min-h-screen bg-[#F8F9FA]">
                <Spinner /> <span className="ml-2 text-gray-700">Đang tải hồ sơ...</span>
            </div>
        );
    }

    // --- Xử lý trạng thái Lỗi ---
    if (error) {
        return <div className="p-8 bg-[#F8F9FA] min-h-screen text-red-600">Lỗi: {error}</div>;
    }

    // --- Hiển thị giao diện ---
    return (
        <div className="flex-grow p-6 md:p-8 bg-[#F8F9FA] min-h-screen">
            <div className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-700 text-3xl">Hồ sơ</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột 1: Thẻ Thông tin Cá nhân */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <img
                            src={user.avatar_url || 'https://i.pravatar.cc/150?u=user'}
                            alt={user.name}
                            className="w-32 h-32 rounded-full mx-auto shadow-md border-4 border-pink-400 object-cover"
                        />
                        <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        {/* ... (Các thông tin chi tiết khác của user) ... */}
                        <div className="mt-6 border-t pt-4 text-left space-y-3">
                            <div className="flex items-center text-gray-700 text-sm">
                                <Icon name="work_outline" className="text-gray-500 mr-3 text-lg" />
                                <span>Developer</span>
                            </div>
                            <div className="flex items-center text-gray-700 text-sm">
                                <Icon name="phone" className="text-gray-500 mr-3 text-lg" />
                                <span>{user.phone || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột 2 & 3: Dự án và Thống kê */}
                <div className="lg:col-span-2 flex flex-col space-y-6">
                    {/* Thẻ Dự án */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Dự án đã tạo ({userProjects.length})
                            </h2>
                            <a href="/projects" className="text-sm font-medium text-blue-600 hover:underline">
                                Xem tất cả
                            </a>
                        </div>

                        {/* Hiển thị Dự án */}
                        {userProjects.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {userProjects.map((project) => (
                                    <Link
                                        key={project._id}
                                        to={`/projects/${project._id}`} // 3. Tạo đường dẫn động
                                    >
                                        <ProjectMiniCard project={project} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Bạn chưa tạo dự án nào.</p>
                        )}
                    </div>

                    {/* Thẻ Tiến độ Dự án và Công việc Hoàn thành */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Dự án tham gia ({projectsWithStats.length})
                                </h2>

                                {/* 1. Kiểm tra nếu không có dự án nào CẢ */}
                                {projectsWithStats.length === 0 ? (
                                    <p className="text-gray-500">Bạn chưa tham gia dự án nào.</p>
                                ) : (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                                        {/* 2. Luôn render các dự án CHƯA HOÀN THÀNH */}
                                        {incompleteProjects.map((projectStat) => (
                                            <ProjectProgressCard key={projectStat._id} project={projectStat} />
                                        ))}

                                        {/* 3. Nút Bấm Ẩn/Hiện */}
                                        {completedProjects.length > 0 && (
                                            <button
                                                onClick={() => setShowCompleted((prev) => !prev)}
                                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm rounded-lg py-2 px-4 transition-colors font-medium text-sm w-full"
                                            >
                                                {showCompleted ? 'Ẩn' : 'Hiển thị'} {completedProjects.length} dự án đã
                                                hoàn thành
                                            </button>
                                        )}

                                        {/* 4. Chỉ render các dự án HOÀN THÀNH nếu showCompleted = true */}
                                        {showCompleted &&
                                            completedProjects.map((projectStat) => (
                                                <ProjectProgressCard key={projectStat._id} project={projectStat} />
                                            ))}

                                        {/* 5. Hiển thị thông báo nếu chỉ có dự án hoàn thành (và đang bị ẩn) */}
                                        {incompleteProjects.length === 0 &&
                                            completedProjects.length > 0 &&
                                            !showCompleted && (
                                                <p className="text-gray-500 text-sm">Tất cả dự án đều đã hoàn thành.</p>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <WorkDoneCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
