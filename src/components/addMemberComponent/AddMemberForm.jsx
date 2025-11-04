import { useEffect, useState } from 'react';
import MemberList from './ListMember';
import { getMembersByProject, searchUsers, addMember } from '../../services/projectMemberService';

export default function AddMemberForm({ projectId, onClose }) {
    const [projectMembers, setProjectMembers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Lấy danh sách thành viên hiện có của project
    const fetchMembers = async () => {
        try {
            const data = await getMembersByProject(projectId);
            setProjectMembers(data);
        } catch (error) {
            console.error('Lỗi khi tải thành viên dự án:', error);
        }
    };

    //load danh sách member render lần đầu
    useEffect(() => {
        fetchMembers();
    }, []);

    // Danh sách theo tìm kiếm
    useEffect(() => {
        if (!searchText.trim()) {
            return; // nếu ô trống thì không tìm
        }
        const delay = setTimeout(async () => {
            try {
                const result = await searchUsers(searchText); // Gọi API tìm kiếm
                setSearchResults(result || []);
            } catch (err) {
                console.error('Lỗi tìm kiếm user:', err);
            }
        }, 1000); // delay 1 giây sau khi gõ
        return () => clearTimeout(delay); // cleanup nếu người dùng vẫn đang gõ
    }, [searchText]);

    // click thêm user vào project
    const handlerAddMember = async (userId) => {
        try {
            const message = await addMember(projectId, userId);
            await fetchMembers(); // Cập nhật lại danh sách
            setSearchText(''); // Xóa ô tìm
            console.log(message);
        } catch (error) {
            console.error('Không thể thêm thành viên:', error);
            alert(error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg w-[500px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Thêm thành viên</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        ✕
                    </button>
                </div>

                {/* Ô nhập tìm kiếm */}
                <div className="flex mb-4 gap-2">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Nhập email hoặc tên..."
                        className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    />
                </div>

                {/* Danh sách kết quả tìm kiếm */}
                <MemberList
                    title="Người dùng phù hợp"
                    members={searchResults}
                    active={searchText ? true : false}
                    onAdd={handlerAddMember}
                />

                {/* Danh sách thành viên hiện tại */}
                <MemberList title="Thành viên hiện tại" members={projectMembers} active={true} />
            </div>
        </div>
    );
}
