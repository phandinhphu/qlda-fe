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
        <div className="bg-white rounded p-4">
            <div className="flex items-center gap-2 mb-3">
                <Icon name="group" className="text-gray-700" />
                <h3 className="font-semibold text-gray-800">Thành viên</h3>
            </div>

            {/* Hiển thị danh sách thành viên đã gán */}
            {members.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {members.map((member) => (
                        <div
                            key={member._id}
                            className="group relative flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50"
                        >
                            <img
                                src={getAvatarUrl(member)}
                                alt={getMemberName(member)}
                                className="w-8 h-8 rounded-full object-cover"
                                title={getMemberName(member)}
                            />
                            <span className="text-sm text-gray-700">{getMemberName(member)}</span>
                            <button
                                onClick={() => handleRemoveMember(member._id)}
                                className="opacity-0 group-hover:opacity-100 ml-1 text-gray-400 hover:text-red-500 transition-opacity"
                                title="Xóa thành viên"
                            >
                                <Icon name="close" className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Form thêm thành viên */}
            {showAddForm ? (
                <div className="border border-gray-300 rounded p-3 bg-gray-50">
                    {availableMembers.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {availableMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => handleAddMember(member.id)}
                                    disabled={loading}
                                    className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors text-left"
                                >
                                    <img
                                        src={
                                            member.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'U')}&background=random`
                                        }
                                        alt={member.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.email}</p>
                                    </div>
                                    {loading && <Icon name="hourglass_empty" className="text-gray-400" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Tất cả thành viên đã được gán</p>
                    )}
                    <button
                        onClick={() => setShowAddForm(false)}
                        className="mt-2 w-full text-gray-700 px-4 py-2 rounded text-sm transition-colors hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddForm(true)}
                    disabled={availableMembers.length === 0}
                    className="w-full text-left text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 p-3 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    + Thêm thành viên
                </button>
            )}
        </div>
    );
}
