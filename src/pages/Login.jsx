import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import { getCurrentUser } from '../services/authServices';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';
import { API_URL } from '../utils/constants';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login, saveUser } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors and toast
        setErrors({});
        setToast(null);

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login(email, password);
            setToast({
                message: 'Đăng nhập thành công! Đang chuyển hướng...',
                type: 'success',
            });

            const response = await getCurrentUser();
            saveUser(response.user);

            navigate('/');
        } catch (error) {
            setToast({
                message: error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập</h1>
                    <p className="text-sm text-gray-500">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors({ ...errors, email: '' });
                                }
                            }}
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors({ ...errors, password: '' });
                                }
                            }}
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                                errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Spinner size="sm" />
                                <span>Đang đăng nhập...</span>
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-xs text-gray-500 font-medium">HOẶC TIẾP TỤC VỚI</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Google Button */}
                <button
                    type="button"
                    onClick={() => {
                        window.location.href = `${API_URL}/api/auth/google`;
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2.5 transition"
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.5 0 6 1.5 7.4 2.8l5.4-5.4C34.6 4 29.8 2 24 2 14.9 2 7.3 7.6 4 15.2l6.3 4.9C12 14 17.6 9.5 24 9.5z"
                        />
                        <path
                            fill="#34A853"
                            d="M46.5 24c0-1.7-.1-3.3-.4-4.8H24v9.1h12.7c-.5 2.7-2 5-4.2 6.6l6.6 5.2C44.3 36.3 46.5 30.6 46.5 24z"
                        />
                        <path
                            fill="#4A90E2"
                            d="M10.3 28.1c-.6-1.8-.9-3.7-.9-5.6s.3-3.8.9-5.6L4 12.1C2.1 15.8 1 19.8 1 24s1.1 8.2 3 11.9l6.3-7.8z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M24 46c6.3 0 11.7-2.1 15.6-5.8l-7.5-6c-2.1 1.4-4.6 2.2-8.1 2.2-6.4 0-11.9-4.5-13.8-10.6L4 35.8C7.3 43.4 14.9 49 24 49z"
                        />
                    </svg>
                    <span className="font-semibold text-gray-700 text-sm">Google</span>
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-5">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
