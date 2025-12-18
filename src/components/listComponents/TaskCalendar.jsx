import React, { useMemo, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import Toast from '../../components/Toast';
import { vi } from 'date-fns/locale';
import { isValid } from 'date-fns';
import { setDueDate } from '../../services/taskServices';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
const locales = { vi: vi };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

export default function TaskCalendar({ tasks, onTaskUpdated }) {
    // State quản lý ngày và view (để nút bấm hoạt động)
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [toast, setToast] = useState(null);
    // Chuyển đổi dữ liệu
    const events = useMemo(() => {
        return tasks
            .map((task) => {
                if (!task.due_date && !task.start_date) return null;
                const startDate = task.start_date ? new Date(task.start_date) : new Date(task.due_date);
                const endDate = task.due_date ? new Date(task.due_date) : startDate;

                if (!isValid(startDate) || !isValid(endDate)) return null;

                return {
                    id: task._id,
                    title: task.title,
                    start: startDate,
                    end: endDate,
                    resource: task,
                };
            })
            .filter(Boolean);
    }, [tasks]);

    const handleNavigate = (newDate) => setDate(newDate);
    const handleViewChange = (newView) => setView(newView);

    const onEventDrop = ({ event, start }) => {
        if (onTaskUpdated) {
            onTaskUpdated(event.id, start);
        }
        try {
            setDueDate(event.id, start);
            setToast({ type: 'success', message: 'Cập nhật ngày thành công.', duration: 1000 });
        } catch (err) {
            setToast({ type: 'error', message: 'Cập nhật ngày thất bại.' });
        }
    };

    return (
        <div className="h-[600px] bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <DnDCalendar
                localizer={localizer}
                date={date}
                view={view}
                views={['month', 'agenda']}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                events={events}
                onEventDrop={onEventDrop}
                resizable={false}
                draggableAccessor={() => true}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                culture="vi"
                eventPropGetter={(event) => {
                    const isDone = event.resource.status === 'done';
                    return {
                        style: {
                            backgroundColor: isDone ? '#10B981' : '#3B82F6',
                            borderRadius: '4px',
                            opacity: 0.9,
                            color: 'white',
                            border: 'none',
                            display: 'block',
                        },
                    };
                }}
                messages={{
                    next: 'Sau',
                    previous: 'Trước',
                    today: 'Hôm nay',
                    month: 'Tháng',
                    week: 'Tuần',
                    day: 'Ngày',
                    agenda: 'Lịch biểu',
                    noEventsInRange: 'Không có công việc nào.',
                }}
            />
        </div>
    );
}
