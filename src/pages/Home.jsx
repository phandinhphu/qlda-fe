import { useAuth } from '../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { logout as logoutService } from '../services/authServices';
const Home = () => {
    // 1. Lấy user và hàm logout từ hook
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log('User data:', user);

    // 2. Tạo hàm xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await logoutService(); // Gọi hàm logout từ context (hoặc service)
            navigate('/login'); // Chuyển hướng về trang đăng nhập
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
            alert('Đăng xuất thất bại, vui lòng thử lại.');
        }
    };

    return (
        <div className="home-page p-8 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>

            {user ? (
                <div>
                    <p className="text-xl mb-6">Hello, {user.name}!</p>

                    {/* 3. Thêm nút đăng xuất */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            ) : (
                <p>Đang tải thông tin người dùng...</p>
            )}
        </div>
    );
};

export default Home;
