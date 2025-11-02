import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/auth';
import { getProjectsByUser } from '../services/projectService'; // Import service mới
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
// Component Icon (Tiện ích)
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

// --- Component con: Thẻ Project nhỏ ---
const ProjectMiniCard = ({ project }) => (
    <div className="text-center">
        {/* Dùng ảnh placeholder nếu không có thumbnail */}
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
    const [userProjects, setUserProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Chỉ chạy khi user đã được load và có _id
        if (user && user._id) {
            const fetchProjects = async () => {
                try {
                    setLoading(true);

                    // GỌI API LẤY DỰ ÁN
                    const data = await getProjectsByUser(user._id);
                    setUserProjects(data);
                } catch (err) {
                    setError(err.message);
                    setUserProjects([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchProjects();
        }
    }, [user]); // Phụ thuộc vào user

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
                                Dự án của tôi ({userProjects.length})
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
                                        to={`/project/${project._id}`} // 3. Tạo đường dẫn động
                                    >
                                        <ProjectMiniCard project={project} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Bạn chưa tạo dự án nào.</p>
                        )}
                    </div>

                    {/* Thẻ Thống kê (Dữ liệu mẫu) */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">Thống kê công việc</h2>
                        {/* ... (Bạn có thể đặt WorkDoneCard vào đây) ... */}
                    </div>
                </div>
            </div>
        </div>
    );
}
