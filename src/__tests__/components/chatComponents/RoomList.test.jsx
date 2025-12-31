import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RoomList from '../../../components/chatComponents/RoomList';
import * as chatServices from '../../../services/chatServices';

// Mock services
vi.mock('../../../services/chatServices');

// Mock hooks
vi.mock('../../../hooks/socket', () => ({
    useSocket: () => ({
        socket: {
            on: vi.fn(),
            off: vi.fn(),
        },
    }),
}));

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RoomList Component', () => {
    const mockOnSelectRoom = vi.fn();
    const mockRooms = [
        {
            _id: 'room1',
            name: 'Test Room 1',
            type: 'group',
            project_id: { _id: 'project1', project_name: 'Test Project' },
            last_message: {
                message: 'Hello there',
                created_at: new Date().toISOString(),
            },
            unread_count: 3,
        },
        {
            _id: 'room2',
            name: 'Test Room 2',
            type: 'direct',
            other_member: {
                _id: 'user1',
                name: 'John Doe',
                avatar_url: 'https://example.com/avatar.jpg',
            },
            last_message: {
                message: 'How are you doing today? This is a very long message that should be truncated',
                created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            },
            unread_count: 0,
        },
        {
            _id: 'room3',
            name: 'Empty Room',
            type: 'group',
            project_id: { _id: 'project2', project_name: 'Another Project' },
            unread_count: 0,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        chatServices.getUserChatRooms.mockResolvedValue({
            success: true,
            data: mockRooms,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Rendering', () => {
        it('should render loading state initially', () => {
            chatServices.getUserChatRooms.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: [] }), 100)),
            );
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);
            expect(screen.getByText('Đang tải...')).toBeInTheDocument();
        });

        it('should render room list after loading', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
            });
        });

        it('should render header with title and back button', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('Tin nhắn')).toBeInTheDocument();
                expect(screen.getByTitle('Quay lại dự án')).toBeInTheDocument();
            });
        });

        it('should render search input', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Tìm kiếm cuộc trò chuyện...')).toBeInTheDocument();
            });
        });

        it('should display empty state when no rooms', async () => {
            chatServices.getUserChatRooms.mockResolvedValue({
                success: true,
                data: [],
            });

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('Chưa có cuộc trò chuyện nào')).toBeInTheDocument();
            });
        });
    });

    describe('Room Display', () => {
        it('should display group room with Users icon', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                const room = screen.getByText('Test Room 1').closest('button');
                expect(room).toBeInTheDocument();
            });
        });

        it('should display direct room with avatar', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                const avatar = screen.getByAltText('John Doe');
                expect(avatar).toBeInTheDocument();
                expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
            });
        });

        it('should display room name correctly', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            });
        });

        it('should display last message preview', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Hello there')).toBeInTheDocument();
            });
        });

        it('should truncate long messages', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                const messageText = screen.getByText(/How are you doing today/);
                expect(messageText.textContent).toContain('...');
                expect(messageText.textContent.length).toBeLessThanOrEqual(53); // 50 chars + "..."
            });
        });

        it('should display unread count badge', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('3')).toBeInTheDocument();
            });
        });

        it('should display "99+" for unread count over 99', async () => {
            const roomsWithManyUnread = [
                {
                    ...mockRooms[0],
                    unread_count: 150,
                },
            ];
            chatServices.getUserChatRooms.mockResolvedValue({
                success: true,
                data: roomsWithManyUnread,
            });

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('99+')).toBeInTheDocument();
            });
        });

        it('should display time ago for recent messages', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                const timeElements = screen.getAllByText(/giờ|phút|Vừa xong/);
                expect(timeElements.length).toBeGreaterThan(0);
            });
        });

        it('should display online indicator for direct chat', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                const room = screen.getByText('John Doe').closest('button');
                const onlineIndicator = room?.querySelector('.bg-green-500');
                expect(onlineIndicator).toBeInTheDocument();
            });
        });
    });

    describe('Search Functionality', () => {
        it('should filter rooms based on search query', async () => {
            const user = userEvent.setup();
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText('Tìm kiếm cuộc trò chuyện...');
            await user.type(searchInput, 'John');

            await waitFor(() => {
                expect(screen.getByText('John Doe')).toBeInTheDocument();
                expect(screen.queryByText('Test Room 1')).not.toBeInTheDocument();
            });
        });

        it('should show empty state when search has no results', async () => {
            const user = userEvent.setup();
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText('Tìm kiếm cuộc trò chuyện...');
            await user.type(searchInput, 'NonExistentRoom');

            await waitFor(() => {
                expect(screen.getByText('Không tìm thấy cuộc trò chuyện')).toBeInTheDocument();
            });
        });

        it('should search case-insensitively', async () => {
            const user = userEvent.setup();
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText('Tìm kiếm cuộc trò chuyện...');
            await user.type(searchInput, 'test room');

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
            });
        });
    });

    describe('Room Selection', () => {
        it('should call onSelectRoom when room is clicked', async () => {
            const user = userEvent.setup();
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
            });

            const roomButton = screen.getByText('Test Room 1').closest('button');
            await user.click(roomButton);

            expect(mockOnSelectRoom).toHaveBeenCalledWith(expect.objectContaining({ _id: 'room1' }));
        });

        it('should highlight selected room', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId="room1" projectId="project1" />);

            await waitFor(() => {
                const selectedRoom = screen.getByText('Test Room 1').closest('button');
                expect(selectedRoom).toHaveClass('bg-blue-50');
                expect(selectedRoom).toHaveClass('border-l-blue-600');
            });
        });

        it('should reset unread count when room is selected', async () => {
            const user = userEvent.setup();
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('3')).toBeInTheDocument();
            });

            const roomButton = screen.getByText('Test Room 1').closest('button');
            await user.click(roomButton);

            // After selection, unread count should not be visible
            await waitFor(() => {
                const unreadBadge = screen.queryByText('3');
                expect(unreadBadge).not.toBeInTheDocument();
            });
        });
    });

    describe('Project Filtering', () => {
        it('should filter rooms by projectId', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
                // Room 2 is direct chat without project, should not appear
                expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
            });
        });

        it('should show all rooms when no projectId provided', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Test Room 1')).toBeInTheDocument();
                expect(screen.getByText('John Doe')).toBeInTheDocument();
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle API error gracefully', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            chatServices.getUserChatRooms.mockRejectedValue(new Error('API Error'));

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading rooms:', expect.any(Error));
            });

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Empty States', () => {
        it('should show correct message for empty room', async () => {
            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId={null} />);

            await waitFor(() => {
                expect(screen.getByText('Empty Room')).toBeInTheDocument();
                const emptyRoomButton = screen.getByText('Empty Room').closest('button');
                expect(emptyRoomButton?.textContent).toContain('Chưa có tin nhắn');
            });
        });
    });

    describe('Time Formatting', () => {
        it('should display "Vừa xong" for messages less than 1 minute old', async () => {
            const recentMessage = [
                {
                    ...mockRooms[0],
                    last_message: {
                        message: 'Just now',
                        created_at: new Date().toISOString(),
                    },
                },
            ];
            chatServices.getUserChatRooms.mockResolvedValue({
                success: true,
                data: recentMessage,
            });

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText('Vừa xong')).toBeInTheDocument();
            });
        });

        it('should display minutes for messages less than 1 hour old', async () => {
            const recentMessage = [
                {
                    ...mockRooms[0],
                    last_message: {
                        message: 'Recent',
                        created_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
                    },
                },
            ];
            chatServices.getUserChatRooms.mockResolvedValue({
                success: true,
                data: recentMessage,
            });

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText(/30 phút/)).toBeInTheDocument();
            });
        });

        it('should display hours for messages less than 1 day old', async () => {
            const recentMessage = [
                {
                    ...mockRooms[0],
                    last_message: {
                        message: 'Hours ago',
                        created_at: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
                    },
                },
            ];
            chatServices.getUserChatRooms.mockResolvedValue({
                success: true,
                data: recentMessage,
            });

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText(/5 giờ/)).toBeInTheDocument();
            });
        });

        it('should display days for messages less than 1 week old', async () => {
            const recentMessage = [
                {
                    ...mockRooms[0],
                    last_message: {
                        message: 'Days ago',
                        created_at: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
                    },
                },
            ];
            chatServices.getUserChatRooms.mockResolvedValue({
                success: true,
                data: recentMessage,
            });

            renderWithRouter(<RoomList onSelectRoom={mockOnSelectRoom} selectedRoomId={null} projectId="project1" />);

            await waitFor(() => {
                expect(screen.getByText(/3 ngày/)).toBeInTheDocument();
            });
        });
    });
});
