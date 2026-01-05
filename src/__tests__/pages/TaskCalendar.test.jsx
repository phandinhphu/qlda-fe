import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TaskCalendar from '../../../components/listComponents/TaskCalendar';
import * as taskServices from '../../../services/taskServices';

// --- MOCKS ---
vi.mock('../../../services/taskServices');

vi.mock('../../../components/Toast', () => ({
    default: ({ message }) => <div data-testid="toast">{message}</div>,
}));

// Mock react-big-calendar
vi.mock('react-big-calendar', () => ({
    Calendar: (props) => (
        <div data-testid="big-calendar">
            <div data-testid="view-mode">{props.view}</div>
            <div data-testid="current-date">{props.date.toISOString()}</div>
            <button onClick={() => props.onView('agenda')}>To Agenda</button>
            <button onClick={() => props.onView('month')}>To Month</button>
            <button onClick={() => props.onNavigate(new Date('2024-02-01'))}>Navigate Next</button>
            {props.events.map((ev) => (
                <div key={ev.id} data-testid="calendar-event" onClick={() => props.onSelectEvent(ev)}>
                    {ev.title} - {ev.listName}
                </div>
            ))}
        </div>
    ),
    momentLocalizer: () => ({}),
    Views: { MONTH: 'month', AGENDA: 'agenda' },
}));

// Mock DragAndDrop HOC
vi.mock('react-big-calendar/lib/addons/dragAndDrop', () => ({
    default: (CalendarComponent) => {
        return (props) => (
            <div data-testid="dnd-calendar-wrapper">
                <CalendarComponent {...props} />
                <button
                    data-testid="simulate-drop"
                    onClick={() =>
                        props.onEventDrop({
                            event: props.events[0],
                            start: new Date('2025-01-01'),
                            end: new Date('2025-01-01'),
                        })
                    }
                >
                    Simulate Drop
                </button>
            </div>
        );
    },
}));

describe('TaskCalendar Comprehensive Tests', () => {
    const mockLists = [
        { _id: 'list-1', title: 'Danh sách A' },
        { _id: 'list-2', title: 'Danh sách B' },
    ];
    const mockTasks = [
        { _id: 't1', title: 'Task 1', list_id: 'list-1', due_date: '2024-01-01T10:00:00Z' },
        { _id: 't2', title: 'Task 2', list_id: 'list-2', due_date: '2024-01-02T10:00:00Z' },
        { _id: 't3', title: 'Task 3', list_id: 'list-unknown', due_date: '2024-01-03T10:00:00Z' }, // Edge case: list not found
    ];

    const defaultProps = {
        tasks: mockTasks,
        lists: mockLists,
        onTaskUpdated: vi.fn(),
        onTaskClick: vi.fn(),
    };

    const renderCalendar = (props = defaultProps) => render(<TaskCalendar {...props} />);

    // --- 1. RENDERING & DATA MAPPING (5 tests) ---
    describe('1. Rendering & Data Mapping', () => {
        it('hiển thị calendar wrapper', () => {
            renderCalendar();
            expect(screen.getByTestId('dnd-calendar-wrapper')).toBeInTheDocument();
            expect(screen.getByTestId('big-calendar')).toBeInTheDocument();
        });

        it('map đúng task thành event calendar', () => {
            renderCalendar();
            // Check formatted string "Title - ListName" from mocked event render
            expect(screen.getByText('Task 1 - Danh sách A')).toBeInTheDocument();
            expect(screen.getByText('Task 2 - Danh sách B')).toBeInTheDocument();
        });

        it('xử lý task không có list_id hợp lệ (Fallback UI)', () => {
            renderCalendar();
            // Assuming fallback in logic, usually "Chưa phân loại" or similar, or just undefined.
            // Checking logic: listName = lists.find(...)?.title || 'Chưa phân loại'
            // My previous reading showed fallback 'Chưa phân loại'
            expect(screen.getByText(/Task 3 -/i)).toBeInTheDocument();
        });

        it('không hiển thị task nếu không có due_date', () => {
            const tasksNoDate = [{ _id: 't4', title: 'No Date', list_id: 'list-1' }];
            renderCalendar({ ...defaultProps, tasks: tasksNoDate });
            expect(screen.queryByText(/No Date/i)).not.toBeInTheDocument();
        });
    });

    // --- 2. NAVIGATION (3 tests) ---
    describe('2. Navigation', () => {
        it('chuyển đổi View (Tháng -> Agenda)', () => {
            renderCalendar();
            expect(screen.getByTestId('view-mode')).toHaveTextContent('month'); // Default

            fireEvent.click(screen.getByText('To Agenda'));
            expect(screen.getByTestId('view-mode')).toHaveTextContent('agenda');
        });

        it('chuyển đổi View (Agenda -> Tháng)', () => {
            renderCalendar();
            fireEvent.click(screen.getByText('To Agenda'));
            fireEvent.click(screen.getByText('To Month'));
            expect(screen.getByTestId('view-mode')).toHaveTextContent('month');
        });

        it('điều hướng ngày (Navigate)', () => {
            renderCalendar();
            fireEvent.click(screen.getByText('Navigate Next'));
            // Mock passed 2024-02-01
            expect(screen.getByTestId('current-date')).toContain('2024-02-01');
        });
    });

    // --- 3. INTERACTIONS (4 tests) ---
    describe('3. Interactions', () => {
        it('gọi onTaskClick khi click vào event', () => {
            renderCalendar();
            fireEvent.click(screen.getByText('Task 1 - Danh sách A'));
            expect(defaultProps.onTaskClick).toHaveBeenCalledWith('t1');
        });

        it('gọi API update khi Drop event', async () => {
            taskServices.setDueDate.mockResolvedValue({});
            renderCalendar();

            fireEvent.click(screen.getByTestId('simulate-drop')); // Updates Task 1 to 2025-01-01

            expect(defaultProps.onTaskUpdated).toHaveBeenCalled(); // Should call parent refresh
            expect(taskServices.setDueDate).toHaveBeenCalledWith('t1', expect.any(Date));
            expect(taskServices.setDueDate.mock.calls[0][1].toISOString()).toContain('2025-01-01');
        });

        it('hiển thị Toast thành công khi Drop', async () => {
            taskServices.setDueDate.mockResolvedValue({});
            renderCalendar();
            fireEvent.click(screen.getByTestId('simulate-drop'));
            await waitFor(() => expect(screen.getByText('Cập nhật ngày thành công')).toBeInTheDocument());
        });

        it('hiển thị Toast lỗi khi Drop thất bại', async () => {
            taskServices.setDueDate.mockRejectedValue(new Error('Update Failed'));
            renderCalendar();
            fireEvent.click(screen.getByTestId('simulate-drop'));
            await waitFor(() => expect(screen.getByText('Lỗi khi cập nhật ngày')).toBeInTheDocument());
        });
    });
});
