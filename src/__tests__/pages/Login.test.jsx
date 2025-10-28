import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../utils/testUtils';
import Login from '../../pages/Login';
import { useAuth } from '../../hooks/auth';
import { getCurrentUser } from '../../services/authServices';

// Create mock functions at module level
const mockLogin = vi.fn();
const mockSaveUser = vi.fn();
const mockGetCurrentUser = vi.fn();

// Mock the auth hook
vi.mock('../../hooks/auth');

// Mock the auth service
vi.mock('../../services/authServices');

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mocks
        vi.mocked(useAuth).mockReturnValue({
            login: mockLogin,
            saveUser: mockSaveUser,
        });

        vi.mocked(getCurrentUser).mockImplementation(mockGetCurrentUser);
    });

    describe('Rendering', () => {
        it('should render login form with all elements', () => {
            renderWithRouter(<Login />);

            // Check header
            expect(screen.getByRole('heading', { name: /đăng nhập/i })).toBeInTheDocument();
            expect(screen.getByText(/chào mừng trở lại/i)).toBeInTheDocument();

            // Check form fields
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();

            // Check buttons
            expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();

            // Check link to register
            expect(screen.getByRole('link', { name: /đăng ký/i })).toBeInTheDocument();
        });

        it('should render divider text', () => {
            renderWithRouter(<Login />);
            expect(screen.getByText(/hoặc tiếp tục với/i)).toBeInTheDocument();
        });
    });

    describe('Form Validation', () => {
        it('should show error when email is empty', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Login />);

            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
            });
        });

        it('should show error when email format is invalid', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'invalid-email');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument();
            });
        });

        it('should show error when password is empty', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/mật khẩu là bắt buộc/i)).toBeInTheDocument();
            });
        });

        it('should show error when password is less than 6 characters', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, '12345');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/mật khẩu phải có ít nhất 6 ký tự/i)).toBeInTheDocument();
            });
        });

        it('should clear error when user starts typing', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            // Trigger validation error
            await user.click(submitButton);
            await waitFor(() => {
                expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
            });

            // Start typing should clear error
            await user.type(emailInput, 't');
            await waitFor(() => {
                expect(screen.queryByText(/email là bắt buộc/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Form Submission', () => {
        it('should call login function with correct credentials on valid submit', async () => {
            const user = userEvent.setup();
            mockLogin.mockResolvedValue({});
            mockGetCurrentUser.mockResolvedValue({ id: 1, email: 'test@example.com' });

            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            });
        });

        it('should show loading state during submission', async () => {
            const user = userEvent.setup();
            mockLogin.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            // Check loading state
            await waitFor(() => {
                expect(screen.getByText(/đang đăng nhập/i)).toBeInTheDocument();
            });

            // Check inputs are disabled
            expect(emailInput).toBeDisabled();
            expect(passwordInput).toBeDisabled();
            expect(submitButton).toBeDisabled();
        });

        it('should show success toast on successful login', async () => {
            const user = userEvent.setup();
            mockLogin.mockResolvedValue({});
            mockGetCurrentUser.mockResolvedValue({ id: 1, email: 'test@example.com' });

            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/đăng nhập thành công/i)).toBeInTheDocument();
            });
        });

        it('should show error toast on failed login', async () => {
            const user = userEvent.setup();
            mockLogin.mockRejectedValue(new Error('Email hoặc mật khẩu không đúng'));

            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'wrongpassword');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/email hoặc mật khẩu không đúng/i)).toBeInTheDocument();
            });
        });

        it('should disable form during submission', async () => {
            const user = userEvent.setup();

            let resolveLogin;
            mockLogin.mockImplementation(
                () =>
                    new Promise((resolve) => {
                        resolveLogin = resolve;
                    }),
            );

            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(submitButton).toBeDisabled();
                expect(emailInput).toBeDisabled();
                expect(passwordInput).toBeDisabled();
            });

            resolveLogin();
        });
    });

    describe('Navigation', () => {
        it('should have link to register page', () => {
            renderWithRouter(<Login />);
            const registerLink = screen.getByRole('link', { name: /đăng ký/i });
            expect(registerLink).toHaveAttribute('href', '/register');
        });
    });

    describe('Accessibility', () => {
        it('should have proper labels for form inputs', () => {
            renderWithRouter(<Login />);

            const emailInput = screen.getByLabelText(/email/i);
            const passwordInput = screen.getByLabelText(/mật khẩu/i);

            expect(emailInput).toHaveAttribute('id', 'email');
            expect(passwordInput).toHaveAttribute('id', 'password');
        });

        it('should show error messages with icons', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Login />);

            const submitButton = screen.getByRole('button', { name: /đăng nhập/i });
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessage = screen.getByText(/email là bắt buộc/i);
                expect(errorMessage).toBeInTheDocument();
                expect(errorMessage.closest('p')).toHaveClass('text-red-600');
            });
        });
    });
});
