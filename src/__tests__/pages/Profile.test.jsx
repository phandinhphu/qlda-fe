import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../../pages/Profile';
import { useAuth } from '../../hooks/auth';
import * as projectServices from '../../services/projectServices';

// --- MOCKS ---
vi.mock('../../hooks/auth');
vi.mock('../../services/projectServices');

vi.mock('../../components/Spinner', () => ({
    default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../../components/Toast', () => ({
    default: ({ message }) => <div data-testid="toast">{message}</div>,
}));

vi.mock('../../components/profileComponents/WorkDoneCard', () => ({
    default: () => <div data-testid="work-done-card">Work Done Stats</div>,
}));

vi.mock('../../components/profileComponents/ProjectProgressCard', () => ({
    default: ({ project }) => (
        <div data-testid={`project-card-${project._id}`}>
            {project.project_name} - {project.percentage}%
        </div>
    ),
}));

describe('ProfilePage Comprehensive Tests', () => {
    const mockUser = {
        _id: 'user-1',
        name: 'Nguyen Van A',
        email: 'vana@example.com',
        avatar_url: 'http://avatar.com/a.jpg',
        phone: '0909090909',
    };

    const mockCreatedProjects = [
        { _id: 'p1', project_name: 'Created Project 1', thumbnail_url: '' },
        { _id: 'p2', project_name: 'Created Project 2', thumbnail_url: '' },
    ];

    const mockStatsProjects = [
        { _id: 'p3', project_name: 'Participated Project 1', percentage: 75 },
        { _id: 'p4', project_name: 'Participated Project 2', percentage: 100 }, // Completed
        { _id: 'p5', project_name: 'Participated Project 3', percentage: 20 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Default Mock Setup
        useAuth.mockReturnValue({ user: mockUser });
        projectServices.getProjectsByUser.mockResolvedValue(mockCreatedProjects);
        projectServices.getMyProjectsWithStats.mockResolvedValue(mockStatsProjects);
    });

    const renderPage = () =>
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>,
        );

    // --- 1. AUTH & LOADING STATE (4 tests) ---
    describe('1. Auth & Loading', () => {
        it('hiển thị spinner khi đang fetch data', () => {
            projectServices.getProjectsByUser.mockImplementation(() => new Promise(() => {}));
            renderPage();
            expect(screen.getByTestId('spinner')).toBeInTheDocument();
            expect(screen.getByText('Đang tải hồ sơ...')).toBeInTheDocument();
        });

        it('hiển thị spinner nếu không có user (chưa login)', async () => {
            useAuth.mockReturnValue({ user: null });
            renderPage();
            // Component renders loading state if user is null
            expect(screen.getByText('Đang tải hồ sơ...')).toBeInTheDocument();
        });

        it('gọi API lấy dữ liệu dự án khi mount', async () => {
            renderPage();
            await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
            expect(projectServices.getProjectsByUser).toHaveBeenCalledWith(mockUser._id);
            expect(projectServices.getMyProjectsWithStats).toHaveBeenCalled();
        });
    });

    // --- 2. USER INFO DISPLAY (4 tests) ---
    describe('2. User Info Display', () => {
        it('hiển thị tên và email người dùng', async () => {
            renderPage();
            await waitFor(() => expect(screen.getByText('Nguyen Van A')).toBeInTheDocument());
            expect(screen.getByText('vana@example.com')).toBeInTheDocument();
        });

        it('hiển thị avatar người dùng', async () => {
            renderPage();
            await waitFor(() => {
                const img = screen.getByAltText(mockUser.name);
                expect(img).toHaveAttribute('src', mockUser.avatar_url);
            });
        });

        it('hiển thị WorkDoneCard', async () => {
            renderPage();
            await waitFor(() => expect(screen.getByTestId('work-done-card')).toBeInTheDocument());
        });
    });

    // --- 3. PROJECT PROJECT LISTS (6 tests) ---
    describe('3. Project Lists Display', () => {
        it('hiển thị danh sách dự án đã tạo', async () => {
            renderPage();
            await waitFor(() => expect(screen.getByText(/Dự án đã tạo \(2\)/i)).toBeInTheDocument());
            expect(screen.getByText('Created Project 1')).toBeInTheDocument();
            expect(screen.getByText('Created Project 2')).toBeInTheDocument();
        });

        it('hiển thị danh sách dự án tham gia (chưa hoàn thành)', async () => {
            renderPage();
            await waitFor(() => expect(screen.getByTestId('project-card-p3')).toBeInTheDocument());
            expect(screen.getByText(/Participated Project 1 - 75%/i)).toBeInTheDocument();
            expect(screen.getByText(/Participated Project 3 - 20%/i)).toBeInTheDocument();
        });

        it('mặc định ẩn dự án đã hoàn thành (100%)', async () => {
            renderPage();
            await waitFor(() => expect(screen.getByTestId('project-card-p3')).toBeInTheDocument());
            // p4 is 100% complete
            expect(screen.queryByTestId('project-card-p4')).not.toBeInTheDocument();
        });

        it('toggle hiển thị dự án đã hoàn thành', async () => {
            renderPage();
            await waitFor(() => expect(screen.getByText(/Hiển thị 1 dự án đã hoàn thành/i)).toBeInTheDocument());

            const toggleBtn = screen.getByText(/Hiển thị 1 dự án đã hoàn thành/i);
            fireEvent.click(toggleBtn);

            expect(screen.getByTestId('project-card-p4')).toBeInTheDocument();
            expect(screen.getByText(/Ẩn 1 dự án đã hoàn thành/i)).toBeInTheDocument();

            fireEvent.click(screen.getByText(/Ẩn 1 dự án đã hoàn thành/i));
            expect(screen.queryByTestId('project-card-p4')).not.toBeInTheDocument();
        });
    });

    // --- 4. ERROR HANDLING (3 tests) ---
    describe('4. Error Handling', () => {
        it('hiển thị thông báo lỗi khi fetch projects thất bại', async () => {
            projectServices.getProjectsByUser.mockRejectedValue(new Error('Fetch Failed'));
            renderPage();
            await waitFor(() => expect(screen.getByText(/Lỗi:.*Fetch Failed/i)).toBeInTheDocument());
        });

        it('hiển thị thông báo lỗi khi fetch stats thất bại', async () => {
            projectServices.getMyProjectsWithStats.mockRejectedValue(new Error('Stats Failed'));
            renderPage();
            await waitFor(() => expect(screen.getByText(/Lỗi:.*Stats Failed/i)).toBeInTheDocument());
        });
    });
});
