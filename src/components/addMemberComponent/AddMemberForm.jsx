import { useEffect, useState } from 'react';
import MemberList from './ListMember';
import { getMembersByProject, searchUsers, addMember } from '../../services/projectMemberService';

export default function AddMemberForm({ projectId, onClose }) {
    const [projectMembers, setProjectMembers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchMembers = async () => {
        try {
            const data = await getMembersByProject(projectId);
            setProjectMembers(data);
        } catch (error) {
            console.error('Lỗi khi tải thành viên dự án:', error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        if (!searchText.trim()) return;
        const delay = setTimeout(async () => {
            try {
                const result = await searchUsers(searchText);
                setSearchResults(result || []);
            } catch (err) {
                console.error('Lỗi tìm kiếm user:', err);
            }
        }, 1000);
        return () => clearTimeout(delay);
    }, [searchText]);

    const handlerAddMember = async (userId) => {
        try {
            const message = await addMember(projectId, userId);
            await fetchMembers();
            setSearchText('');
            console.log(message);
        } catch (error) {
            console.error('Không thể thêm thành viên:', error);
            alert(error.message);
        }
    };

    return (
        <div
            className="
                fixed inset-0 
                bg-white/60 backdrop-blur-sm 
                flex justify-center items-center 
                z-50
            "
        >
            <div className="bg-white text-gray-800 p-6 rounded-lg w-[500px] shadow-xl border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Thêm thành viên</h2>
                    <button
                        onClick={onClose}
                        className="
                        bg-gray-200 hover:bg-gray-400
                        text-gray-500 hover:text-gray-700 
                        text-lg font-bold leading-none
                        transition
                    "
                        aria-label="Đóng"
                    >
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
                        className="flex-1 p-2 rounded bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
