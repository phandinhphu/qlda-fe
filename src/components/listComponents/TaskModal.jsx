import { useState, useEffect, useRef } from 'react';
import { setDueDate, getTaskById, uploadTaskFile } from '../../services/taskServices';
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
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const fileInputRef = useRef(null);
    const [newUploadedFile, setNewUploadedFile] = useState(null);
    const calendarRef = useRef(null);
    const loadTaskDetail = async () => {
        try {
            setLoading(true);
            const data = await getTaskById(taskId);
            setTask(data);
            setDate(data.due_date ? new Date(data.due_date) : null);
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
        };
        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

    useEffect(() => {
        if (isOpen && taskId) {
            loadTaskDetail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, taskId]);

    const handleTaskUpdate = (updatedTask) => {
        setTask(updatedTask);
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
            className="fixed inset-0 bg-gray-100/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-6"
            onClick={onClose}
        >
            <div
                className="bg-gray-200 rounded-lg w-full max-w-5xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : task ? (
                    <>
                        {/* Header */}
                        <div className="bg-gray-200 p-6 pb-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <Icon name="check_box" className="text-gray-700 text-2xl" />
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{task.title}</h2>
                                        <p className="text-sm text-gray-600">
                                            trong danh sách{' '}
                                            <span className="font-medium">{task.list_id?.title || 'N/A'}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-300 p-2 rounded transition-colors"
                                >
                                    <Icon name="close" className="text-2xl" />
                                </button>
                            </div>

                            {/* Buttons Row */}
                            <div className="flex gap-2">
                                <button
                                    className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-sm transition-colors"
                                    onClick={handleAttachClick}
                                >
                                    <Icon name="attachment" className="text-base" />
                                    <span>Đính kèm</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelected}
                                />

                                <button className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-sm transition-colors">
                                    <Icon name="label" className="text-base" />
                                    <span>Nhãn</span>
                                </button>
                                <div className="relative inline-block" ref={calendarRef}>
                                    <button
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                                            date
                                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' // Style khi ĐÃ có ngày
                                                : 'bg-gray-300 hover:bg-gray-400 text-gray-800' // Style khi CHƯA có ngày
                                        }`}
                                        onClick={() => setShowCalendar(!showCalendar)}
                                    >
                                        <Icon name="event" className="text-base" />

                                        {/* 4. HIỂN THỊ NGÀY ĐÃ CHỌN */}
                                        <span>
                                            {date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Ngày đến hạn'}
                                        </span>
                                    </button>

                                    {showCalendar && (
                                        // Style dropdown lịch
                                        <div className="absolute top-full left-0 mt-2 z-50 bg-white shadow-xl rounded-lg border border-gray-200">
                                            <Calendar
                                                selected={date}
                                                onSelect={handleSelectDueDate}
                                                // Thêm mode="single" nếu Calendar của bạn cần prop này
                                            />
                                        </div>
                                    )}
                                </div>
                                <button className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-sm transition-colors">
                                    <Icon name="checklist" className="text-base" />
                                    <span>Việc cần làm</span>
                                </button>
                                <button className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-sm transition-colors">
                                    <Icon name="group" className="text-base" />
                                    <span>Thành viên</span>
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 bg-gray-200 flex-1 overflow-y-auto">
                            <div className="flex gap-6">
                                {/* Left Content */}
                                <div className="flex-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                                    {/* Description */}
                                    <TaskModalDescription task={task} onUpdate={handleTaskUpdate} />

                                    {/* Labels */}
                                    <TaskModalLabels
                                        task={task}
                                        onUpdate={handleTaskUpdate}
                                        onLabelsChange={onLabelsChange}
                                    />

                                    {/* Members */}
                                    <TaskModalMembers
                                        task={task}
                                        onUpdate={handleTaskUpdate}
                                        onMembersChange={onMembersChange}
                                    />

                                    {/* Steps */}
                                    <TaskModalSteps task={task} onUpdate={handleTaskUpdate} />

                                    {/* Files */}
                                    <TaskModalAttachments taskId={taskId} newFile={newUploadedFile} />
                                </div>

                                {/* Right Sidebar - Comments */}
                                <div className="w-[460px] shrink-0 max-h-[80vh] overflow-y-auto">
                                    <TaskModalComments task={task} onUpdate={handleTaskUpdate} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-96 text-gray-500">Không tìm thấy task</div>
                )}
            </div>
        </div>
    );
}
