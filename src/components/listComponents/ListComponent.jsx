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
        window.location.reload();
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
        <div ref={setNodeRef} style={style} className="flex-shrink-0 w-[300px] relative">
            <div className="flex flex-col max-h-full bg-gray-100 rounded-lg p-4 shadow-sm border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={handleTitleKeyDown}
                            onBlur={handleTitleSave} // Tự động lưu khi click ra ngoài
                            className="text-lg font-semibold text-gray-900 w-full p-0 border-b-2 border-blue-500 focus:outline-none"
                        />
                    ) : (
                        <h2
                            {...attributes}
                            {...listeners}
                            className="text-left text-lg font-semibold text-gray-900 cursor-grab w-full"
                        >
                            {list.title}
                        </h2>
                    )}
                    <button
                        ref={buttonRef}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="bg-gray-900/5 hover:bg-gray-900/10 text-gray-700 p-1 rounded-md transition-colors border border-gray-200 shadow-sm"
                    >
                        <Icon name="more_horiz" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-1">
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
                        <div className="bg-white rounded-lg p-2.5 shadow-sm mt-2 border border-gray-200">
                            <textarea
                                // SỬA ĐỔI: Nền, chữ, viền
                                className="w-full bg-white text-gray-900 p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                                placeholder="Nhập tiêu đề cho thẻ này..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                rows={3}
                                autoFocus
                            />
                            <div className="flex items-center mt-2.5">
                                <button
                                    onClick={handleAddTask}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3.5 rounded-md text-sm transition-colors"
                                >
                                    Thêm thẻ
                                </button>
                                <button
                                    onClick={handleToggleAddTaskForm}
                                    className="text-gray-500 bg-gray-900/7 hover:bg-gray-900/10 py-1 px-2 rounded-md ml-2 transition-colors"
                                >
                                    <Icon name="close" className="text-xl" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nút Thêm Thẻ */}
                {!showAddTaskForm && (
                    <button
                        onClick={handleToggleAddTaskForm}
                        className="flex items-center w-full mt-2 p-2.5 bg-gray-900/5 hover:bg-gray-900/10 text-gray-700 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Icon name="add" className="mr-2 text-lg" />
                        <span className="text-sm font-medium">Thêm thẻ</span>
                    </button>
                )}
            </div>
            {isMenuOpen && (
                <div ref={menuRef}>
                    <ListMenu onDelete={handleDeleteList} onRename={handleRenameClick} />
                </div>
            )}

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
