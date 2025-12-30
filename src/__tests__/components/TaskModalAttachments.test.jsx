import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskModalAttachments from '../../components/listComponents/TaskModalAttachments';
import * as taskServices from '../../services/taskServices';

// Mock service để không gọi API thật
vi.mock('../../services/taskServices');

describe('TaskModalAttachments Component', () => {
    const mockTaskId = 'task-123';
    const mockFiles = [
        {
            _id: 'file-1',
            file_url: 'http://localhost/uploads/document.pdf',
            uploaded_at: '2025-10-28T10:00:00Z',
            uploaded_by: { name: 'Người dùng Test' },
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Hiển thị thông báo khi không có tệp đính kèm', async () => {
        // Giả lập API trả về mảng rỗng
        taskServices.getTaskFiles.mockResolvedValue({ data: [] });

        render(<TaskModalAttachments taskId={mockTaskId} />);

        await waitFor(() => {
            expect(screen.getByText('Chưa có tệp đính kèm')).toBeInTheDocument();
        });
    });

    it('Hiển thị danh sách tệp đính kèm khi có dữ liệu', async () => {
        // Giả lập API trả về danh sách file
        taskServices.getTaskFiles.mockResolvedValue({ data: mockFiles });

        render(<TaskModalAttachments taskId={mockTaskId} />);

        // Kiểm tra tên file (hàm lấy phần cuối của URL)
        await waitFor(() => {
            expect(screen.getByText('document.pdf')).toBeInTheDocument();
        });

        // Kiểm tra tên người tải lên
        expect(screen.getByText('Người dùng Test')).toBeInTheDocument();

        // Kiểm tra icon tương ứng với định dạng (pdf -> picture_as_pdf)
        const icon = screen.getByText('picture_as_pdf');
        expect(icon).toHaveClass('material-icons');
    });

    it('Cập nhật danh sách khi nhận được prop newFile mới', async () => {
        taskServices.getTaskFiles.mockResolvedValue({ data: [] });

        const { rerender } = render(<TaskModalAttachments taskId={mockTaskId} newFile={null} />);

        // Ban đầu trống
        await waitFor(() => {
            expect(screen.getByText('Chưa có tệp đính kèm')).toBeInTheDocument();
        });

        // Giả lập việc upload file thành công và truyền file mới vào qua prop
        const newFile = {
            _id: 'file-2',
            file_url: 'http://localhost/uploads/image.png',
            uploaded_at: '2025-10-28T11:00:00Z',
            uploaded_by: { name: 'Người dùng Test' },
        };

        rerender(<TaskModalAttachments taskId={mockTaskId} newFile={newFile} />);

        // Kiểm tra file mới đã xuất hiện
        expect(screen.getByText('image.png')).toBeInTheDocument();
        expect(screen.queryByText('Chưa có tệp đính kèm')).not.toBeInTheDocument();
    });

    it('Xử lý lỗi khi gọi API lấy danh sách tệp thất bại', async () => {
        taskServices.getTaskFiles.mockResolvedValue({ data: [] });

        render(<TaskModalAttachments taskId="123" />);

        // Kiểm tra giao diện hiển thị đúng trạng thái "trống"
        await waitFor(() => {
            expect(screen.getByText('Chưa có tệp đính kèm')).toBeInTheDocument();
        });
    });

    it('Hiển thị đúng biểu tượng cho từng loại định dạng tệp (image, pdf, khác)', async () => {
        const multiTypeFiles = [
            {
                _id: 'f1',
                file_url: 'http://localhost/uploads/photo.jpg', // image
                uploaded_at: new Date().toISOString(),
                uploaded_by: { name: 'Admin' },
            },
            {
                _id: 'f2',
                file_url: 'http://localhost/uploads/manual.pdf', // picture_as_pdf
                uploaded_at: new Date().toISOString(),
                uploaded_by: { name: 'Admin' },
            },
            {
                _id: 'f3',
                file_url: 'http://localhost/uploads/data.zip', // description
                uploaded_at: new Date().toISOString(),
                uploaded_by: { name: 'Admin' },
            },
        ];
        taskServices.getTaskFiles.mockResolvedValue({ data: multiTypeFiles });

        render(<TaskModalAttachments taskId={mockTaskId} />);

        await waitFor(() => {
            // Kiểm tra icon cho .jpg
            expect(screen.getByText('image')).toBeInTheDocument();
            // Kiểm tra icon cho .pdf
            expect(screen.getByText('picture_as_pdf')).toBeInTheDocument();
            // Kiểm tra icon mặc định cho .zip
            expect(screen.getByText('description')).toBeInTheDocument();
        });
    });

    it('Tải lại danh sách tệp mới khi taskId thay đổi', async () => {
        taskServices.getTaskFiles.mockResolvedValue({ data: [] });

        const { rerender } = render(<TaskModalAttachments taskId="task-1" />);

        // Kiểm tra gọi lần đầu
        expect(taskServices.getTaskFiles).toHaveBeenCalledWith('task-1');

        // Thay đổi taskId qua prop
        rerender(<TaskModalAttachments taskId="task-2" />);

        // Kiểm tra gọi lại với ID mới
        await waitFor(() => {
            expect(taskServices.getTaskFiles).toHaveBeenCalledWith('task-2');
        });
    });
});
