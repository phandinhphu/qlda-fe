import { useState, useEffect } from 'react';
import { getTaskMembers, addTaskMember, removeTaskMember } from '../../services/taskServices';
import { getMembersByProject } from '../../services/projectMemberService';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalMembers({ task, onUpdate, onMembersChange }) {
    const [members, setMembers] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch task members
                const taskMembers = await getTaskMembers(task._id);
                setMembers(taskMembers || []);

                // Fetch project members
                if (task.list_id && task.list_id.project_id) {
                    const projectId = task.list_id.project_id._id || task.list_id.project_id;
                    const projMembers = await getMembersByProject(projectId);
                    setProjectMembers(projMembers || []);
                }
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchData();
    }, [task._id, task.list_id]);

    const handleAddMember = async (userId) => {
        try {
            setLoading(true);
            const newMember = await addTaskMember(task._id, userId);
            setMembers([...members, newMember]);
            setShowAddForm(false);
            // Thông báo parent component refresh members
            if (onMembersChange) {
                onMembersChange(task._id);
            }
        } catch (error) {
            console.error('Error adding member:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi task?')) return;

        try {
            setLoading(true);
            await removeTaskMember(task._id, userId);
            setMembers(members.filter((m) => m._id.toString() !== userId.toString()));
            // Thông báo parent component refresh members
            if (onMembersChange) {
                onMembersChange(task._id);
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter out members already assigned
    const availableMembers = projectMembers.filter((pm) => !members.some((m) => m._id.toString() === pm.id.toString()));

    const getAvatarUrl = (member) => {
        if (member.avatar_url) return member.avatar_url;
        if (member.avatar) return member.avatar;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'U')}&background=random`;
    };

    const getMemberName = (member) => {
        return member.name || member.email || 'Unknown';
    };

    return (
        <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Thành viên</h3>

            <div className="flex flex-wrap gap-2 mb-2 items-center">
                {/* Hiển thị danh sách thành viên đã gán */}
                {/* Hiển thị danh sách thành viên đã gán */}
                {members.map((member) => (
                    <div
                        key={member._id}
                        className="group flex items-center gap-2 pr-2 pl-1 py-1 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors cursor-default"
                        title={getMemberName(member)}
                    >
                        <img
                            src={getAvatarUrl(member)}
                            alt={getMemberName(member)}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                            {getMemberName(member)}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMember(member._id);
                            }}
                            className="bg-gray-200 text-gray-400 hover:text-red-500 rounded-full p-0.5 transition-colors opacity-0 group-hover:opacity-100"
                            title="Xóa thành viên"
                        >
                            <Icon name="close" className="text-[14px] font-bold" />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors border border-gray-200"
                    >
                        <Icon name="add" className="text-xl" />
                    </button>

                    {/* Form thêm thành viên - Popover */}
                    {showAddForm && (
                        <div className="absolute top-0 left-0 mt-2 z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-[280px]">
                            <div className="flex justify-between items-center mb-2 border-b pb-1">
                                <h4 className="text-sm font-semibold text-gray-700">Thành viên</h4>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="bg-white text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded p-1 transition-colors"
                                >
                                    <Icon name="close" className="text-base" />
                                </button>
                            </div>

                            {availableMembers.length > 0 ? (
                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {availableMembers.map((member) => (
                                        <button
                                            key={member.id}
                                            onClick={() => handleAddMember(member.id)}
                                            disabled={loading}
                                            className="w-full flex items-center gap-3 p-2 rounded bg-white hover:bg-gray-50 transition-colors text-left text-gray-800"
                                        >
                                            <img
                                                src={
                                                    member.avatar ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'U')}&background=random`
                                                }
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {member.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Tất cả thành viên đã được gán</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
