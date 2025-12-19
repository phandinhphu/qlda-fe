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

export default function TaskCalendar({ tasks, lists, onTaskUpdated }) {
    // State quản lý ngày và view (để nút bấm hoạt động)
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [toast, setToast] = useState(null);

    // Chuyển đổi dữ liệu và map thêm tên List
    const events = useMemo(() => {
        return tasks
            .map((task, index) => {
                if (!task.due_date && !task.start_date) return null;
                const startDate = task.start_date ? new Date(task.start_date) : new Date(task.due_date);
                const endDate = task.due_date ? new Date(task.due_date) : startDate;

                if (!isValid(startDate) || !isValid(endDate)) return null;

                // Tìm tên List
                const listId = typeof task.list_id === 'object' ? task.list_id?._id : task.list_id;
                const listName = lists?.find((l) => l._id === listId)?.title || 'Chưa phân loại';

                return {
                    id: task._id,
                    title: task.title,
                    listName: listName,
                    start: startDate,
                    end: endDate,
                    resource: task,
                };
            })
            .filter(Boolean);
    }, [tasks, lists]);

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

    // Custom Event Component
    const CustomEvent = ({ event }) => (
        <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">{event.title}</span>
            <span className="text-[10px] opacity-90 mt-0.5 truncate bg-black/10 w-fit px-1 rounded">
                {event.listName}
            </span>
        </div>
    );

    return (
        <div className="h-[650px] bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <style>{`
                .rbc-calendar { font-family: 'Inter', sans-serif; }
                .rbc-toolbar-label { font-size: 1.25rem !important; font-weight: 700 !important; color: #1F2937; text-transform: capitalize; }
                .rbc-header { padding: 12px 0 !important; font-weight: 600 !important; color: #4B5563; font-size: 0.9rem; }
                .rbc-month-view { border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #E5E7EB; }
                .rbc-month-row + .rbc-month-row { border-top: 1px solid #E5E7EB; }
                .rbc-event { border-radius: 6px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: grab !important; }
                .rbc-event:active { cursor: grabbing !important; }
                .rbc-today { background-color: #F3F4F6 !important; }
                .rbc-off-range-bg { background-color: #F9FAFB !important; }
            `}</style>
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
                components={{
                    event: CustomEvent,
                }}
                eventPropGetter={(event) => {
                    const isDone = event.resource.status === 'done';
                    return {
                        style: {
                            backgroundColor: isDone ? '#10B981' : '#3B82F6',
                            border: 'none',
                            color: 'white',
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
