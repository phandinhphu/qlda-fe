import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../../components/Toast';

describe('Toast Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should render toast with message', () => {
            render(<Toast message="Test message" type="info" />);
            expect(screen.getByText('Test message')).toBeInTheDocument();
        });

        it('should render success toast with green styling', () => {
            render(<Toast message="Success" type="success" />);
            const toast = screen.getByText('Success').closest('div');
            expect(toast).toHaveClass('bg-green-50');
        });

        it('should render error toast with red styling', () => {
            render(<Toast message="Error" type="error" />);
            const toast = screen.getByText('Error').closest('div');
            expect(toast).toHaveClass('bg-red-50');
        });

        it('should render warning toast with yellow styling', () => {
            render(<Toast message="Warning" type="warning" />);
            const toast = screen.getByText('Warning').closest('div');
            expect(toast).toHaveClass('bg-yellow-50');
        });

        it('should render info toast with blue styling', () => {
            render(<Toast message="Info" type="info" />);
            const toast = screen.getByText('Info').closest('div');
            expect(toast).toHaveClass('bg-blue-50');
        });

        it('should render appropriate icon for each type', () => {
            const { rerender } = render(<Toast message="Test" type="success" />);
            expect(screen.getByText('Test').previousSibling).toBeInTheDocument();

            rerender(<Toast message="Test" type="error" />);
            expect(screen.getByText('Test').previousSibling).toBeInTheDocument();

            rerender(<Toast message="Test" type="warning" />);
            expect(screen.getByText('Test').previousSibling).toBeInTheDocument();

            rerender(<Toast message="Test" type="info" />);
            expect(screen.getByText('Test').previousSibling).toBeInTheDocument();
        });
    });

    describe('Close Button', () => {
        it('should render close button when onClose is provided', () => {
            const onClose = vi.fn();
            render(<Toast message="Test" type="info" onClose={onClose} />);

            const closeButton = screen.getByRole('button');
            expect(closeButton).toBeInTheDocument();
        });

        it('should not render close button when onClose is not provided', () => {
            render(<Toast message="Test" type="info" />);

            const closeButton = screen.queryByRole('button');
            expect(closeButton).not.toBeInTheDocument();
        });

        it('should call onClose when close button is clicked', async () => {
            const user = userEvent.setup({ delay: null });
            const onClose = vi.fn();
            render(<Toast message="Test" type="info" onClose={onClose} />);

            const closeButton = screen.getByRole('button');
            await user.click(closeButton);

            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Auto Close', () => {
        it('should auto close after specified duration', async () => {
            const onClose = vi.fn();
            render(<Toast message="Test" type="info" onClose={onClose} duration={3000} />);

            expect(onClose).not.toHaveBeenCalled();

            vi.advanceTimersByTime(3000);

            await waitFor(() => {
                expect(onClose).toHaveBeenCalledTimes(1);
            });
        });

        it('should use default duration of 3000ms when not specified', async () => {
            const onClose = vi.fn();
            render(<Toast message="Test" type="info" onClose={onClose} />);

            vi.advanceTimersByTime(2999);
            expect(onClose).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);

            await waitFor(() => {
                expect(onClose).toHaveBeenCalledTimes(1);
            });
        });

        it('should not auto close when duration is 0', () => {
            const onClose = vi.fn();
            render(<Toast message="Test" type="info" onClose={onClose} duration={0} />);

            vi.advanceTimersByTime(5000);

            expect(onClose).not.toHaveBeenCalled();
        });

        it('should not auto close when onClose is not provided', () => {
            render(<Toast message="Test" type="info" duration={3000} />);

            vi.advanceTimersByTime(3000);

            // Should not throw error
            expect(screen.getByText('Test')).toBeInTheDocument();
        });

        it('should clear timeout on unmount', () => {
            const onClose = vi.fn();
            const { unmount } = render(<Toast message="Test" type="info" onClose={onClose} duration={3000} />);

            unmount();
            vi.advanceTimersByTime(3000);

            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('Styling and Position', () => {
        it('should be positioned at top right', () => {
            render(<Toast message="Test" type="info" />);
            const container = screen.getByText('Test').closest('div').parentElement;
            expect(container).toHaveClass('fixed', 'top-4', 'right-4');
        });

        it('should have animation classes', () => {
            render(<Toast message="Test" type="info" />);
            const container = screen.getByText('Test').closest('div').parentElement;
            expect(container).toHaveClass('animate-in', 'fade-in');
        });

        it('should have proper z-index for overlay', () => {
            render(<Toast message="Test" type="info" />);
            const container = screen.getByText('Test').closest('div').parentElement;
            expect(container).toHaveClass('z-50');
        });
    });

    describe('Accessibility', () => {
        it('should have appropriate text styling', () => {
            render(<Toast message="Test message" type="info" />);
            const message = screen.getByText('Test message');
            expect(message).toHaveClass('text-sm', 'font-medium');
        });

        it('should have close button with hover effect', () => {
            const onClose = vi.fn();
            render(<Toast message="Test" type="info" onClose={onClose} />);

            const closeButton = screen.getByRole('button');
            expect(closeButton).toHaveClass('hover:text-gray-600');
        });
    });
});
