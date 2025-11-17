import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddMemberForm from '../../../src/components/addMemberComponent/AddMemberForm';
import { renderWithRouter } from '../utils/testUtils';

import { getMembersByProject, searchUsers, addMember } from '../../services/projectMemberService';

vi.mock('../../services/projectMemberService');

describe('AddMemberForm Component', () => {
    const mockMembers = [
        { _id: '1', name: 'Alice', email: 'alice@mail.com', role: 'Owner' },
        { _id: '2', name: 'Bob', email: 'bob@mail.com' },
    ];

    const mockSearchUsers = [{ _id: '3', name: 'Charlie', email: 'charlie@mail.com' }];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getMembersByProject).mockResolvedValue(mockMembers);
        vi.mocked(searchUsers).mockResolvedValue(mockSearchUsers);
        vi.mocked(addMember).mockResolvedValue('Thêm thành viên thành công');
    });

    it('render đúng giao diện và fetch members khi mở form', async () => {
        renderWithRouter(<AddMemberForm projectId="abc123" onClose={() => {}} />);

        expect(screen.getByText(/thêm thành viên/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(getMembersByProject).toHaveBeenCalledWith('abc123');
        });

        // Danh sách thành viên hiện tại
        expect(await screen.findByText('Alice')).toBeInTheDocument();
        expect(await screen.findByText('Bob')).toBeInTheDocument();
    });

    it('gõ vào input sẽ call searchUsers sau 1 giây (debounce)', async () => {
        const user = userEvent.setup();
        renderWithRouter(<AddMemberForm projectId="abc123" onClose={() => {}} />);

        const input = screen.getByPlaceholderText(/nhập email hoặc tên/i);

        await user.type(input, 'cha');

        expect(searchUsers).not.toHaveBeenCalled();

        await waitFor(
            () => {
                expect(searchUsers).toHaveBeenCalledWith('cha');
            },
            { timeout: 1500 },
        );

        expect(await screen.findByText('Charlie')).toBeInTheDocument();
    });

    it('hiển thị "Không có dữ liệu" khi không có kết quả tìm kiếm', async () => {
        vi.mocked(searchUsers).mockResolvedValue([]);

        const user = userEvent.setup();
        renderWithRouter(<AddMemberForm projectId="abc123" onClose={() => {}} />);

        const input = screen.getByPlaceholderText(/nhập email/i);
        await user.type(input, 'zzz');

        await waitFor(() => {
            expect(searchUsers).toHaveBeenCalled();
        });

        expect(await screen.findByText(/không có dữ liệu/i)).toBeInTheDocument();
    });
});
