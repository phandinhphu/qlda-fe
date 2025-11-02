import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authServices';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // Ẩn form khi thành công

    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        // --- Validate ---
        if (!password || !confirmPassword) {
            setToast({ message: 'Vui lòng nhập cả hai trường mật khẩu.', type: 'error' });
            return;
        }
        if (password.length < 6) {
            setToast({ message: 'Mật khẩu phải có ít nhất 6 ký tự.', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setToast({ message: 'Mật khẩu xác nhận không khớp.', type: 'error' });
            return;
        }
        // --- Kết thúc Validate ---

        setIsLoading(true);
        try {
            await authService.resetPassword(token, password);

            setToast({ message: 'Đặt lại mật khẩu thành công! Đang chuyển hướng...', type: 'success' });
            setIsSuccess(true); // Ẩn form

            // Chuyển hướng về trang đăng nhập sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-black-100 p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Đặt lại mật khẩu</h1>
                    <p className="text-sm text-gray-500">Vui lòng nhập mật khẩu mới của bạn.</p>
                </div>

                {isSuccess ? (
                    // Trạng thái thành công
                    <div className="text-center">
                        <p className="text-sm text-green-600">
                            Mật khẩu của bạn đã được cập nhật thành công. Sẽ tự động chuyển về trang đăng nhập.
                        </p>
                        <Link
                            to="/login"
                            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                ) : (
                    // Trạng thái nhập mật khẩu
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="text-left block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Mật khẩu mới
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2.5 border rounded-lg text-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="text-left block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Xác nhận mật khẩu mới
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2.5 border rounded-lg text-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner size="sm" />
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                'Lưu mật khẩu mới'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
