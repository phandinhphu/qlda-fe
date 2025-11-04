import { useState, useRef, useEffect } from 'react';
import TaskCard from './TaskCard';
// 1. Import service API
import { createTask, deleteTask, updateTask } from '../../services/taskServices';
import { deleteList } from '../../services/listServices';
import ListMenu from './ListMenu';
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskComponent({ list, onListDeleted }) {
    // Lấy tasks từ prop (list.tasks từ API sẽ là mảng các task)
    const [tasks, setTasks] = useState(list.tasks || []);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const handleToggleAddTaskForm = () => {
        setShowAddTaskForm((prev) => !prev);
        setNewTaskTitle('');
    };
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
    // 2. Cập nhật hàm handleAddTask
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
        console.log('Clicked task:', taskId);
        // TODO: Mở modal chi tiết task
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

    return (
        // Thẻ div bên ngoài (wrapper) cho phép co giãn
        <div className="flex-shrink-0 w-[300px] relative">
            <div className="flex flex-col max-h-full bg-[#2b2b2b] rounded-xl p-4 shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">{list.title}</h2>
                    <button
                        ref={buttonRef}
                        onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle menu
                        className="text-gray-400 hover:bg-[#4a4a4a] p-1 rounded-md transition-colors"
                    >
                        <Icon name="more_horiz" />
                    </button>
                </div>

                {/* Danh sách Task (cho phép cuộn) */}
                <div className="flex-grow overflow-y-auto pr-1">
                    {/* 3. Thay đổi: Dùng ._id từ database thay vì .id */}
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            title={task.title}
                            onClick={() => handleCardClick(task._id)}
                            onEdit={(editedTitle) => onEditTask(task._id, editedTitle)}
                            onDelete={() => onDeleteTask(task._id)}
                            status={task.status}
                            onToggleStatus={(newStatus) => handleToggleStatus(task._id, newStatus)}
                        />
                    ))}

                    {/* Form thêm task */}
                    {showAddTaskForm && (
                        <div className="bg-[#363636] rounded-lg p-2.5 shadow-sm mt-2">
                            <textarea
                                className="w-full bg-[#4a4a4a] text-gray-200 p-2.5 rounded-md border border-[#555] focus:outline-none focus:border-gray-400 resize-y"
                                placeholder="Nhập tiêu đề cho thẻ này..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                rows={3}
                                autoFocus
                            />
                            <div className="flex items-center mt-2.5">
                                <button
                                    onClick={handleAddTask}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3.5 rounded-md text-sm transition-colors"
                                >
                                    Thêm thẻ
                                </button>
                                <button
                                    onClick={handleToggleAddTaskForm}
                                    className="text-gray-400 hover:bg-[#4a4a4a] p-1.5 rounded-md ml-2 transition-colors"
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
                        className="flex items-center w-full mt-2 p-2.5 bg-[#363636] hover:bg-[#4a4a4a] text-gray-400 hover:text-gray-200 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Icon name="add" className="mr-2 text-lg" />
                        <span className="text-sm font-medium">Thêm thẻ</span>
                    </button>
                )}
            </div>
            {isMenuOpen && (
                <div ref={menuRef}>
                    {' '}
                    {/* Bọc menu trong div có ref */}
                    <ListMenu onDelete={handleDeleteList} />
                </div>
            )}
        </div>
    );
}
