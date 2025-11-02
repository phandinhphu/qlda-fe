import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../services/authServices'; // Import service
import Toast from '../components/Toast'; // Giả sử bạn có component này
import Spinner from '../components/Spinner'; // Giả sử bạn có component này

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Ẩn form sau khi gửi

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);

        if (!email) {
            setToast({ message: 'Vui lòng nhập email của bạn.', type: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            // Luôn hiển thị thông báo thành công (vì lý do bảo mật)
            setIsSubmitted(true); // Ẩn form và hiển thị thông báo
        } catch (error) {
            // Luôn hiển thị thông báo thành công (vì lý do bảo mật)
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {isSubmitted ? (
                    // Trạng thái sau khi gửi
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Đã gửi email</h1>
                        <p className="text-sm text-gray-600 mb-5">
                            Nếu email <strong>{email}</strong> tồn tại trong hệ thống, bạn sẽ nhận được một link đặt lại
                            mật khẩu trong vài phút.
                        </p>
                        <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                ) : (
                    // Trạng thái nhập email
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Quên mật khẩu?</h1>
                            <p className="text-sm text-gray-500">
                                Đừng lo lắng. Hãy nhập email của bạn để nhận link đặt lại mật khẩu.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2.5 border rounded-lg text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-black"
                                    disabled={isLoading}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span>Đang gửi...</span>
                                    </>
                                ) : (
                                    'Gửi link reset'
                                )}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-600 mt-5">
                            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                                Quay lại đăng nhập
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
