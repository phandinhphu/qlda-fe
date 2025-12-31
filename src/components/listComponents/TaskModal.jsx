import { useState, useEffect, useRef } from 'react';
import { setDueDate, getTaskById, uploadTaskFile, setReminderDate } from '../../services/taskServices';
import TaskModalHeader from './TaskModalHeader';
import TaskModalDescription from './TaskModalDescription';
import TaskModalLabels from './TaskModalLabels';
import TaskModalMembers from './TaskModalMembers';
import TaskModalSteps from './TaskModalSteps';
import TaskModalComments from './TaskModalComments';
import TaskModalSidebar from './TaskModalSidebar';
import TaskModalAttachments from './TaskModalAttachments';
import Toast from '../../components/Toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Calendar from '../common/Calendar';
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModal({ taskId, isOpen, onClose, onLabelsChange, onMembersChange }) {
    const [toast, setToast] = useState(null);
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const fileInputRef = useRef(null);
    const [newUploadedFile, setNewUploadedFile] = useState(null);
    const calendarRef = useRef(null);
    const [showReminder, setShowReminder] = useState(false);
    const [reminderDate, setReminderDateState] = useState(null);
    const reminderRef = useRef(null);

    const loadTaskDetail = async () => {
        try {
            setLoading(true);
            const data = await getTaskById(taskId);
            setTask(data);
            setDate(data.due_date ? new Date(data.due_date) : null);
            if (data.reminder_date && data.due_date) {
                const diffTime = Math.abs(new Date(data.due_date) - new Date(data.reminder_date));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    setReminderDateState('Nhắc trước 1 ngày');
                } else if (diffDays === 3) {
                    setReminderDateState('Nhắc trước 3 ngày');
                } else {
                    setReminderDateState(format(new Date(data.reminder_date), 'dd/MM/yyyy HH:mm', { locale: vi }));
                }
            } else {
                setReminderDateState(null);
            }
        } catch (error) {
            console.error('Error loading task:', error);
        } finally {
            setLoading(false);
        }
    };

    //LOGIC ĐÓNG LỊCH KHI CLICK RA NGOÀI
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
            if (reminderRef.current && !reminderRef.current.contains(event.target)) {
                setShowReminder(false);
            }
        };

        if (showCalendar || showReminder) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar, showReminder]);

    useEffect(() => {
        if (isOpen && taskId) {
            loadTaskDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, taskId]);

    const handleTaskUpdate = (updatedTask) => {
        setTask(updatedTask);
    };

    const handleSetReminder = async (days) => {
        setShowReminder(false);
        if (task && task.due_date) {
            const newReminderDate = new Date(task.due_date);
            newReminderDate.setDate(newReminderDate.getDate() - days);

            try {
                await setReminderDate(taskId, newReminderDate);
                if (days == 1) {
                    setReminderDateState('Nhắc trước 1 ngày');
                } else if (days == 3) {
                    setReminderDateState('Nhắc trước 3 ngày');
                }
                setToast({
                    message: `Đã đặt nhắc nhở trước ${days} ngày!`,
                    type: 'success',
                });
            } catch (error) {
                setToast({
                    message: error.message || 'Lỗi đặt nhắc nhở!',
                    type: 'error',
                });
            }
        } else {
            alert('Vui lòng chọn ngày đến hạn trước khi đặt nhắc nhở!');
        }
    };

    if (!isOpen) return null;

    const handleAttachClick = () => {
        fileInputRef.current.click(); // mở hộp thoại chọn file
    };

    const handleSelectDueDate = async (selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
            setShowCalendar(false);

            try {
                await setDueDate(taskId, selectedDate);
                console.log('Cập nhật ngày thành công');
            } catch (error) {
                console.error(error);
                // Nếu lỗi, có thể cân nhắc set lại ngày cũ ở đây
                setToast({
                    message: error.message || 'Lỗi cập nhật ngày!',
                    type: 'error',
                });
            }
        } else {
            setToast({
                message: 'Ngày không hợp lệ!',
                type: 'error',
            });
        }
    };

    const handleFileSelected = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const error = validateFile(file);
        if (error) {
            alert(error);
            e.target.value = '';
            return;
        }

        console.log('File đã chọn:', file.name);
        // Bước 2: gọi API upload
        const data = await uploadTaskFile(taskId, file);
        setNewUploadedFile(data.data);
    };

    function validateFile(file) {
        const maxSize = 2 * 1024 * 1024; // 2MB
        const allowedTypes = [
            'image/png',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (file.size > maxSize) {
            return 'File quá lớn! Vui lòng chọn file dưới 2MB.';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Chỉ chấp nhận PNG, JPG, PDF, DOC, DOCX.';
        }

        return null; // hợp lệ
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-start justify-center z-[1001] overflow-y-auto p-4 md:p-8 animate-fade-in-overlay"
            onClick={onClose}
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div
                className="bg-[#F4F5F7] rounded-xl w-full max-w-4xl shadow-2xl min-h-[50vh] flex flex-col my-auto relative animate-slide-up-fade"
                onClick={(e) => e.stopPropagation()}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : task ? (
                    <>
                        {/* Header */}
                        <div className="bg-[#F4F5F7] px-6 pt-6 pb-2">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <Icon name="check_box" className="text-gray-700 text-2xl mt-1" />
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-1 leading-tight">
                                            {task.title}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            trong danh sách{' '}
                                            <a
                                                href="#"
                                                className="font-medium text-gray-700 underline underline-offset-2 hover:text-blue-700"
                                            >
                                                {task.list_id?.title || 'N/A'}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 p-2 rounded-full transition-colors absolute top-4 right-4"
                                >
                                    <Icon name="close" className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Body - 2 Columns Layout */}
                        <div className="flex flex-col md:flex-row px-6 pb-8 gap-8">
                            {/* Main Content (Left) */}
                            <div className="flex-1 space-y-6 min-w-0">
                                {/* Description */}
                                <div className="space-y-4">
                                    <TaskModalDescription task={task} onUpdate={handleTaskUpdate} />
                                </div>

                                {/* Steps */}
                                <div className="space-y-4">
                                    <TaskModalSteps task={task} onUpdate={handleTaskUpdate} />
                                </div>

                                {/* Files */}
                                <div className="space-y-4">
                                    <TaskModalAttachments taskId={taskId} newFile={newUploadedFile} />
                                </div>

                                {/* Comments */}
                                <div className="space-y-4 pt-4">
                                    <TaskModalComments task={task} onUpdate={handleTaskUpdate} />
                                </div>
                            </div>

                            {/* Sidebar (Right) */}
                            <div className="w-full md:w-64 space-y-4 shrink-0">
                                {/* Component Labels & Members placed in sidebar logic for better UX or kept here but styled nicely */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                                        <TaskModalMembers
                                            task={task}
                                            onUpdate={handleTaskUpdate}
                                            onMembersChange={onMembersChange}
                                        />
                                        <TaskModalLabels
                                            task={task}
                                            onUpdate={handleTaskUpdate}
                                            onLabelsChange={onLabelsChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Thêm vào thẻ
                                    </h3>

                                    <button
                                        onClick={handleAttachClick}
                                        className="w-full justify-start py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded shadow-sm transition-colors flex items-center gap-2"
                                    >
                                        <Icon name="attachment" className="text-lg" />
                                        <span>Đính kèm</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileSelected}
                                    />

                                    {/* Date Picker Button */}
                                    <div className="relative" ref={calendarRef}>
                                        <button
                                            className={`w-full justify-start py-2 px-3 text-sm font-medium rounded shadow-sm transition-colors flex items-center gap-2 ${
                                                date
                                                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                            onClick={() => setShowCalendar(!showCalendar)}
                                        >
                                            <Icon name="event" className="text-lg" />
                                            <span>
                                                {date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Ngày đến hạn'}
                                            </span>
                                        </button>

                                        {showCalendar && (
                                            <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-xl rounded-lg border border-gray-200">
                                                <Calendar selected={date} onSelect={handleSelectDueDate} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative" ref={reminderRef}>
                                        <button
                                            className={`w-full justify-start py-2 px-3 text-sm font-medium rounded shadow-sm transition-colors flex items-center gap-2 ${
                                                showReminder || reminderDate
                                                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            }`}
                                            onClick={() => setShowReminder(!showReminder)}
                                        >
                                            <Icon name="alarm" className="text-lg" />
                                            <span>{reminderDate ? reminderDate : 'Ngày nhắc'}</span>
                                        </button>
                                        {showReminder && (
                                            <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-xl rounded-lg border border-gray-200 w-full overflow-hidden">
                                                <button
                                                    onClick={() => handleSetReminder(1)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-0"
                                                >
                                                    Trước 1 ngày
                                                </button>
                                                <button
                                                    onClick={() => handleSetReminder(3)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                >
                                                    Trước 3 ngày
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Logic */}
                                <div className="space-y-2 pt-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                        Thao tác
                                    </h3>
                                    <button className="w-full justify-start py-2 px-3 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium rounded shadow-sm transition-colors flex items-center gap-2">
                                        <Icon name="delete" className="text-lg" />
                                        <span>Xóa thẻ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <Icon name="error_outline" className="text-4xl mb-2" />
                        <p>Không tìm thấy thẻ</p>
                    </div>
                )}
            </div>
        </div>
    );
}
