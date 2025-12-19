import { useState, useRef, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createTask, deleteTask, updateTask, getTaskLabels, getTaskMembers } from '../../services/taskServices';
import { deleteList, updateList } from '../../services/listServices';
import ListMenu from './ListMenu';
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function ListComponent({ list, onListDeleted, onListTitleUpdated }) {
    // Lấy tasks từ prop (list.tasks từ API sẽ là mảng các task)
    const [tasks, setTasks] = useState(list.tasks || []);

    // Sync state with props when list.tasks changes (e.g. after view switch reload)
    useEffect(() => {
        setTasks(list.tasks || []);
    }, [list.tasks]);

    const [taskLabels, setTaskLabels] = useState({}); // { taskId: [labels] }
    const [taskMembers, setTaskMembers] = useState({}); // { taskId: [members] }
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(list.title);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const titleInputRef = useRef(null);
    const handleToggleAddTaskForm = () => {
        setShowAddTaskForm((prev) => !prev);
        setNewTaskTitle('');
    };
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: list._id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1, // Làm mờ cột khi kéo
    };

    // useEffect để xử lý click bên ngoài menu
    useEffect(() => {
        if (!isMenuOpen) return; // Chỉ chạy khi menu đang mở

        function handleClickOutside(event) {
            // Kiểm tra xem click có ở BÊN NGOÀI menu VÀ BÊN NGOÀI nút 3 chấm không
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false); // Đóng menu
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Dọn dẹp listener khi component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    //useEffect để focus vào input khi isEditingTitle = true
    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.select(); // Chọn toàn bộ text
        }
    }, [isEditingTitle]);

    // Fetch labels cho tất cả tasks
    useEffect(() => {
        const fetchAllLabels = async () => {
            const labelsMap = {};
            for (const task of tasks) {
                try {
                    const labels = await getTaskLabels(task._id);
                    labelsMap[task._id] = labels || [];
                } catch (error) {
                    console.error(`Error fetching labels for task ${task._id}:`, error);
                    labelsMap[task._id] = [];
                }
            }
            setTaskLabels(labelsMap);
        };

        if (tasks.length > 0) {
            fetchAllLabels();
        }
    }, [tasks]);

    // Fetch members cho tất cả tasks
    useEffect(() => {
        const fetchAllMembers = async () => {
            const membersMap = {};
            for (const task of tasks) {
                try {
                    const members = await getTaskMembers(task._id);
                    membersMap[task._id] = members || [];
                } catch (error) {
                    console.error(`Error fetching members for task ${task._id}:`, error);
                    membersMap[task._id] = [];
                }
            }
            setTaskMembers(membersMap);
        };

        if (tasks.length > 0) {
            fetchAllMembers();
        }
    }, [tasks]);

    // Hàm refresh labels cho một task cụ thể
    const refreshTaskLabels = async (taskId) => {
        if (!taskId) return;
        try {
            const labels = await getTaskLabels(taskId);
            setTaskLabels((prev) => ({
                ...prev,
                [taskId]: labels || [],
            }));
        } catch (error) {
            console.error(`Error refreshing labels for task ${taskId}:`, error);
        }
    };

    // Hàm refresh members cho một task cụ thể
    const refreshTaskMembers = async (taskId) => {
        if (!taskId) return;
        try {
            const members = await getTaskMembers(taskId);
            setTaskMembers((prev) => ({
                ...prev,
                [taskId]: members || [],
            }));
        } catch (error) {
            console.error(`Error refreshing members for task ${taskId}:`, error);
        }
    };

    // Cập nhật hàm handleAddTask
    const handleAddTask = async () => {
        if (newTaskTitle.trim() === '') return;

        // Chuẩn bị dữ liệu để gửi lên API
        const taskData = {
            title: newTaskTitle,
            list_id: list._id, // Lấy ID của cột (List) từ prop
            // Thêm các trường khác nếu cần, ví dụ: description
        };

        try {
            // Gọi API
            const createdTask = await createTask(taskData);

            // Cập nhật state với task thật trả về từ server (có _id)
            setTasks((prevTasks) => [...prevTasks, createdTask]);

            // Xóa form
            setNewTaskTitle('');
            setShowAddTaskForm(false);
        } catch (error) {
            // Xử lý nếu API thất bại
            console.error('Lỗi khi tạo task:', error);
            alert(`Lỗi: ${error.message}`); // Thông báo cho người dùng
        }
    };

    const handleCardClick = (taskId) => {
        setSelectedTaskId(taskId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        // Refresh labels và members khi đóng modal để đảm bảo được cập nhật
        if (selectedTaskId) {
            refreshTaskLabels(selectedTaskId);
            refreshTaskMembers(selectedTaskId);
        }
        setIsModalOpen(false);
        setSelectedTaskId(null);
    };

    const onEditTask = async (taskId, editedTitle) => {
        try {
            // Gọi API cập nhật task
            const res = await updateTask(taskId, { title: editedTitle });

            // Cập nhật lại danh sách task trong state
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === taskId ? { ...task, title: editedTitle } : task)),
            );

            console.log('Cập nhật thành công:', res.message);
        } catch (error) {
            console.error('Lỗi khi cập nhật task:', error.message);
            alert(error.message || 'Không thể cập nhật công việc.');
        }
    };

    const onDeleteTask = async (taskId) => {
        if (!window.confirm('Bạn có chắc muốn xóa task này không?')) return;

        try {
            await deleteTask(taskId);
            // Cập nhật lại state tasks
            setTasks((prev) => prev.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Lỗi khi xóa task:', error);
            alert('Xóa thất bại!');
        }
    };

    const handleDeleteList = async () => {
        try {
            await deleteList(list._id); // Gọi API backend
            onListDeleted(list._id); // Báo cho component cha (ProjectPage) xóa list này khỏi UI
            setIsMenuOpen(false); // Đóng menu
        } catch (error) {
            console.error('Lỗi khi xóa list:', error);
            alert(`Lỗi: ${error.message}`);
        }
    };

    const handleToggleStatus = async (taskId, newStatus) => {
        try {
            // Gọi API cập nhật status
            await updateTask(taskId, { status: newStatus });

            // Cập nhật lại trong state
            setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
    };

    const handleRenameClick = () => {
        setNewTitle(list.title); // Đảm bảo input nhận giá trị mới nhất
        setIsEditingTitle(true);
        setIsMenuOpen(false); // Tự động đóng menu
    };

    const handleTitleSave = async () => {
        if (newTitle.trim() === '' || newTitle === list.title) {
            // Nếu title rỗng hoặc không thay đổi, hủy bỏ
            setIsEditingTitle(false);
            setNewTitle(list.title);
            return;
        }
        try {
            // Gọi API
            await updateList(list._id, { title: newTitle });
            // Cập nhật state ở component cha
            onListTitleUpdated(list._id, newTitle);
        } catch (error) {
            console.error('Lỗi khi cập nhật title:', error);
            setNewTitle(list.title); // Quay lại title cũ nếu lỗi
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTitleSave(); // Lưu khi nhấn Enter
        } else if (e.key === 'Escape') {
            setIsEditingTitle(false); // Hủy khi nhấn Escape
            setNewTitle(list.title);
        }
    };

    return (
        // Thẻ div bên ngoài (wrapper) cho phép co giãn
        <div ref={setNodeRef} style={style} className="flex-shrink-0 w-[280px] relative">
            <div className="flex flex-col max-h-full bg-[#F1F2F4] rounded-xl px-3 py-3 shadow-sm border border-transparent mx-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-2 flex-shrink-0 group/header relative pl-1 pr-1">
                    {isEditingTitle ? (
                        <textarea
                            ref={titleInputRef}
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleTitleSave} // Tự động lưu khi click ra ngoài
                            className="text-[15px] font-semibold text-gray-700 w-full p-1 bg-white border border-blue-500 rounded focus:outline-none resize-none overflow-hidden h-[30px]"
                            rows={1}
                        />
                    ) : (
                        <div
                            {...attributes}
                            {...listeners}
                            onClick={() => {
                                // Double click logic could be added here later
                            }}
                            className="text-left text-[15px] font-semibold text-gray-700 cursor-grab active:cursor-grabbing w-full py-1 px-1 -ml-1 rounded truncate hover:bg-gray-200/50 transition-colors"
                        >
                            {list.title}
                        </div>
                    )}
                    <div
                        className={`relative ml-1 transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/header:opacity-100'}`}
                    >
                        <button
                            ref={buttonRef}
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 p-1 rounded shadow-sm border border-gray-200 transition-colors"
                        >
                            <span className="material-icons text-sm">more_horiz</span>
                        </button>

                        {/* List Menu Popup */}
                        {isMenuOpen && (
                            <div ref={menuRef} className="absolute top-full right-0 mt-1 z-50">
                                <ListMenu onDelete={handleDeleteList} onRename={handleRenameClick} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            title={task.title}
                            onClick={() => handleCardClick(task._id)}
                            onEdit={(editedTitle) => onEditTask(task._id, editedTitle)}
                            onDelete={() => onDeleteTask(task._id)}
                            status={task.status}
                            onToggleStatus={(newStatus) => handleToggleStatus(task._id, newStatus)}
                            labels={taskLabels[task._id] || []}
                            members={taskMembers[task._id] || []}
                        />
                    ))}

                    {/* Form thêm task */}
                    {showAddTaskForm && (
                        <div className="bg-white rounded-lg p-2 shadow-sm mt-2 border border-blue-500 animate-in fade-in zoom-in-95 duration-200">
                            <textarea
                                className="w-full text-sm text-gray-800 placeholder-gray-400 p-1 bg-transparent focus:outline-none resize-none"
                                placeholder="Nhập tiêu đề cho thẻ này..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                rows={3}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddTask();
                                    }
                                }}
                            />
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={handleAddTask}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded text-xs transition-colors shadow-sm"
                                >
                                    Thêm thẻ
                                </button>
                                <button
                                    type="button"
                                    onClick={handleToggleAddTaskForm}
                                    className="bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 p-1.5 rounded transition-colors"
                                >
                                    <Icon name="close" className="text-lg" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nút Thêm Thẻ */}
                {!showAddTaskForm && (
                    <button
                        onClick={handleToggleAddTaskForm}
                        className="flex items-center w-full mt-2 p-2 bg-white hover:bg-gray-50 shadow-sm border border-gray-200 text-gray-600 rounded-lg transition-colors flex-shrink-0 group/add"
                    >
                        <span className="material-icons text-lg mr-2 text-gray-500 group-hover/add:text-gray-800">
                            add
                        </span>
                        <span className="text-sm font-medium group-hover/add:text-gray-800">Thêm thẻ</span>
                    </button>
                )}
            </div>

            {/* Task Modal */}
            <TaskModal
                taskId={selectedTaskId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onLabelsChange={refreshTaskLabels}
                onMembersChange={refreshTaskMembers}
            />
        </div>
    );
}
