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
                bg-black/40 backdrop-blur-sm 
                flex justify-center items-center 
                z-50
                animate-in fade-in duration-200
            "
        >
            <div className="bg-white text-gray-800 p-6 rounded-xl w-[500px] shadow-2xl border border-gray-100 transform transition-all scale-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Thêm thành viên</h2>
                    <button
                        onClick={onClose}
                        className="
                        p-1 rounded-md
                        text-gray-400 hover:text-gray-600 hover:bg-gray-100
                        transition-colors
                    "
                        aria-label="Đóng"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Ô nhập tìm kiếm */}
                <div className="flex mb-4 gap-2">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Nhập email hoặc tên thành viên..."
                        className="flex-1 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                        autoFocus
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
