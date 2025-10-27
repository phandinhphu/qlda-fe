import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '../utils/testUtils';
import Register from '../../pages/Register';
import { useAuth } from '../../hooks/auth';

// Create mock function at module level
const mockRegister = vi.fn();

// Mock the auth hook
vi.mock('../../hooks/auth');

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Register Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock
        vi.mocked(useAuth).mockReturnValue({
            register: mockRegister,
        });
    });

    describe('Rendering', () => {
        it('should render register form with all elements', () => {
            renderWithRouter(<Register />);

            // Check header
            expect(screen.getByRole('heading', { name: /tạo tài khoản/i })).toBeInTheDocument();
            expect(screen.getByText(/bắt đầu quản lý lịch trình/i)).toBeInTheDocument();

            // Check form fields
            expect(screen.getByLabelText(/tên hiển thị/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^mật khẩu$/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/xác nhận mật khẩu/i)).toBeInTheDocument();

            // Check button
            expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument();

            // Check link to login
            expect(screen.getByRole('link', { name: /đăng nhập/i })).toBeInTheDocument();
        });

        it('should render input fields with icons', () => {
            renderWithRouter(<Register />);

            // All inputs should have icons (svg elements)
            const inputs = screen.getAllByRole('textbox');
            expect(inputs.length).toBeGreaterThan(0);
        });
    });

    describe('Form Validation', () => {
        it('should show error when display name is empty', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const submitButton = screen.getByRole('button', { name: /đăng ký/i });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/tên hiển thị là bắt buộc/i)).toBeInTheDocument();
            });
        });

        it('should show error when display name is too short', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'a');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/tên hiển thị phải có ít nhất 2 ký tự/i)).toBeInTheDocument();
            });
        });

        it('should show error when email is empty', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
            });
        });

        it('should show error when email format is invalid', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'invalid-email');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument();
            });
        });

        it('should show error when password is less than 6 characters', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, '12345');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/mật khẩu phải có ít nhất 6 ký tự/i)).toBeInTheDocument();
            });
        });

        it('should show error when password does not contain uppercase and lowercase', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'password');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/mật khẩu phải chứa cả chữ hoa và chữ thường/i)).toBeInTheDocument();
            });
        });

        it('should show error when confirm password is empty', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/vui lòng xác nhận mật khẩu/i)).toBeInTheDocument();
            });
        });

        it('should show error when confirm password does not match', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'DifferentPassword123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/mật khẩu xác nhận không khớp/i)).toBeInTheDocument();
            });
        });

        it('should clear error when user starts typing in error field', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            // Trigger validation error
            await user.click(submitButton);
            await waitFor(() => {
                expect(screen.getByText(/tên hiển thị là bắt buộc/i)).toBeInTheDocument();
            });

            // Start typing should clear error
            await user.type(displayNameInput, 'T');
            await waitFor(() => {
                expect(screen.queryByText(/tên hiển thị là bắt buộc/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Form Submission', () => {
        it('should call register function with correct data on valid submit', async () => {
            const user = userEvent.setup();
            mockRegister.mockResolvedValue({});

            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'Password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Password123',
                });
            });
        });

        it('should show loading state during submission', async () => {
            const user = userEvent.setup();
            mockRegister.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'Password123');
            await user.click(submitButton);

            // Check loading state
            await waitFor(() => {
                expect(screen.getByText(/đang đăng ký/i)).toBeInTheDocument();
            });

            // Check inputs are disabled
            expect(displayNameInput).toBeDisabled();
            expect(emailInput).toBeDisabled();
            expect(passwordInput).toBeDisabled();
            expect(confirmInput).toBeDisabled();
            expect(submitButton).toBeDisabled();
        });

        it('should show success toast on successful registration', async () => {
            const user = userEvent.setup();
            mockRegister.mockResolvedValue({});

            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'Password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/đăng ký thành công/i)).toBeInTheDocument();
            });
        });

        it('should show error toast on failed registration', async () => {
            const user = userEvent.setup();
            mockRegister.mockRejectedValue(new Error('Email đã được sử dụng'));

            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'Password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/email đã được sử dụng/i)).toBeInTheDocument();
            });
        });

        it('should clear form after successful registration', async () => {
            const user = userEvent.setup();
            mockRegister.mockResolvedValue({});

            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'Password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(displayNameInput).toHaveValue('');
                expect(emailInput).toHaveValue('');
                expect(passwordInput).toHaveValue('');
                expect(confirmInput).toHaveValue('');
            });
        });

        it('should disable form during submission', async () => {
            const user = userEvent.setup();

            let resolveRegister;
            mockRegister.mockImplementation(
                () =>
                    new Promise((resolve) => {
                        resolveRegister = resolve;
                    }),
            );

            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);
            const submitButton = screen.getByRole('button', { name: /đăng ký/i });

            await user.type(displayNameInput, 'Test User');
            await user.type(emailInput, 'test@example.com');
            await user.type(passwordInput, 'Password123');
            await user.type(confirmInput, 'Password123');
            await user.click(submitButton);

            await waitFor(() => {
                expect(submitButton).toBeDisabled();
                expect(displayNameInput).toBeDisabled();
                expect(emailInput).toBeDisabled();
                expect(passwordInput).toBeDisabled();
                expect(confirmInput).toBeDisabled();
            });

            resolveRegister();
        });
    });

    describe('Navigation', () => {
        it('should have link to login page', () => {
            renderWithRouter(<Register />);
            const loginLink = screen.getByRole('link', { name: /đăng nhập/i });
            expect(loginLink).toHaveAttribute('href', '/login');
        });
    });

    describe('Accessibility', () => {
        it('should have proper labels for form inputs', () => {
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);
            const passwordInput = screen.getByLabelText(/^mật khẩu$/i);
            const confirmInput = screen.getByLabelText(/xác nhận mật khẩu/i);

            expect(displayNameInput).toHaveAttribute('id', 'displayName');
            expect(emailInput).toHaveAttribute('id', 'email');
            expect(passwordInput).toHaveAttribute('id', 'password');
            expect(confirmInput).toHaveAttribute('id', 'confirm');
        });

        it('should show error messages with appropriate styling', async () => {
            const user = userEvent.setup();
            renderWithRouter(<Register />);

            const submitButton = screen.getByRole('button', { name: /đăng ký/i });
            await user.click(submitButton);

            await waitFor(() => {
                const errorMessages = screen.getAllByText(/là bắt buộc/i);
                errorMessages.forEach((error) => {
                    expect(error.closest('p')).toHaveClass('text-red-600');
                });
            });
        });

        it('should have input placeholders', () => {
            renderWithRouter(<Register />);

            const displayNameInput = screen.getByLabelText(/tên hiển thị/i);
            const emailInput = screen.getByLabelText(/^email$/i);

            expect(displayNameInput).toHaveAttribute('placeholder', 'Tên của bạn');
            expect(emailInput).toHaveAttribute('placeholder', 'mail@example.com');
        });
    });
});
