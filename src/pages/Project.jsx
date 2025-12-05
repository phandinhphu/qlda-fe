// src/pages/ProjectPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ListComponent from '../components/listComponents/ListComponent';
import AddListForm from '../components/listComponents/AddListForm';
import { getListsByProject, createList, reorderLists } from '../services/listServices';
import { getProjectById } from '../services/projectServices';
import Header from '../components/HeaderComponents/Header';
import ShareButton from '../components/addMemberComponent/ShareButton';
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Link } from 'react-router-dom';
const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function ProjectPage() {
    const { projectId } = useParams();
    const [lists, setLists] = useState([]); // State này là một MẢNG (array)
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
    const [activeList, setActiveList] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'list', 'task', 'member'
    const [dateFilter, setDateFilter] = useState(''); // 'today', 'week', 'month' hoặc ''

    const filteredLists = useMemo(() => {
        let result = lists;
        if (searchTerm.trim() !== '') {
            const lowerTerm = searchTerm.toLowerCase();

            result = result.filter((list) => {
                // Kiểm tra Tên List
                const matchListName = list.title.toLowerCase().includes(lowerTerm);
                const hasMatchingTask = list.tasks.some((task) => {
                    // Check tên Task
                    const taskTitle = task.title ? task.title.toLowerCase() : '';
                    const matchTaskName = taskTitle.includes(lowerTerm);

                    // Check tên Member
                    let matchMember = false;
                    if (task.assigned_to && task.assigned_to.name) {
                        matchMember = task.assigned_to.name.toLowerCase().includes(lowerTerm);
                    }

                    // Trả về true nếu task này khớp điều kiện tìm kiếm
                    if (filterType === 'task') return matchTaskName;
                    if (filterType === 'member') return matchMember;
                    return matchTaskName || matchMember;
                });
                if (filterType === 'list') {
                    return matchListName;
                }
                if (filterType === 'task') {
                    return hasMatchingTask;
                }
                if (filterType === 'member') {
                    return hasMatchingTask;
                }
                return matchListName || hasMatchingTask;
            });
        }
        if (dateFilter) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            result = result
                .map((list) => {
                    const filteredTasks = list.tasks.filter((task) => {
                        if (!task.due_date) return false;

                        const taskDate = new Date(task.due_date);
                        taskDate.setHours(0, 0, 0, 0);

                        if (dateFilter === 'today') {
                            return taskDate.getTime() === now.getTime();
                        }
                        if (dateFilter === 'week') {
                            const oneWeekAgo = new Date(now);
                            oneWeekAgo.setDate(now.getDate() - 7);
                            return taskDate >= oneWeekAgo && taskDate <= now;
                        }
                        if (dateFilter === 'month') {
                            return (
                                taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear()
                            );
                        }
                        return true;
                    });
                    return { ...list, tasks: filteredTasks };
                })
                // Loại bỏ các List không có Task nào sau khi lọc
                .filter((list) => list.tasks.length > 0);
        }

        return result;
    }, [lists, searchTerm, filterType, dateFilter]);
    useEffect(() => {
        const fetchData = async () => {
            if (projectId) {
                setLoading(true);
                try {
                    const data = await getListsByProject(projectId);
                    setLists(data);
                    const dataProject = await getProjectById(projectId);
                    setProject(dataProject);
                } catch (error) {
                    console.error('Lỗi khi tải project:', error);
                    setLists([]);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [projectId]);

    const handleSaveList = async (title) => {
        const newList = await createList(projectId, title);
        setLists((prevLists) => [...prevLists, newList]);
    };
    const handleListDeleted = (deletedListId) => {
        setLists((prevLists) => prevLists.filter((list) => list._id !== deletedListId));
    };
    const handleListTitleUpdated = (listId, newTitle) => {
        setLists((prevLists) => prevLists.map((list) => (list._id === listId ? { ...list, title: newTitle } : list)));
    };
    //Xử lý kéo thả
    const handleDragStart = (event) => {
        const { active } = event;

        const list = lists.find((l) => l._id === active.id);
        if (list) {
            setActiveList(list);
        }
    };
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }
        // cập nhật UI
        setLists((currentLists) => {
            const oldIndex = currentLists.findIndex((list) => list._id === active.id);
            const newIndex = currentLists.findIndex((list) => list._id === over.id);
            const reorderedLists = arrayMove(currentLists, oldIndex, newIndex);
            const orderedListIds = reorderedLists.map((list) => list._id);
            //Gọi APIbackend
            reorderLists(orderedListIds).catch((err) => {
                console.error('Lỗi khi lưu thứ tự List:', err);
                alert('Không thể lưu thứ tự mới, vui lòng thử lại.');
            });
            //Trả về state mới cho React render
            return reorderedLists;
        });
        setActiveList(null);
    };

    if (loading) return <div className="text-gray-700 p-8">Đang tải project...</div>;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col w-screen h-screen bg-gray-100 text-gray-900 overflow-hidden">
                <Header />

                {/* 3. Thêm nền trắng và viền dưới cho header của Project */}
                <header className="p-4 flex items-center justify-between bg-white border-b border-gray-200">
                    <h1 className="text-2xl font-bold pl-4">{project.project_name}</h1>
                </header>
                <header className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow max-w-md">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon name="search" className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon name="filter_list" className="text-gray-500 text-lg" />
                        </span>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="appearance-none py-2 pl-10 pr-8 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <option value="all">Lọc</option>
                            <option value="list">Danh sách</option>
                            <option value="task">Thẻ công việc</option>
                            <option value="member">Thành viên</option>
                        </select>
                        {/* Mũi tên tùy chỉnh (Optional - để đẹp hơn mũi tên mặc định) */}
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <Icon name="expand_more" className="text-gray-400" />
                        </span>
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Icon name="calendar_today" className="text-gray-500 text-lg" />
                        </span>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="appearance-none py-2 pl-10 pr-8 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <option value="">Mọi lúc</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">7 ngày qua</option>
                            <option value="month">Tháng này</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <Icon name="expand_more" className="text-gray-400" />
                        </span>
                    </div>
                    <div className="ml-auto">
                        <ShareButton projectId={project._id} />
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Nút chat */}
                        <Link
                            to={`/chat/project/${project._id}`}
                            className="text-gray-400 hover:text-gray-900 hover:border-none relative bg-white focus:border-none focus:bg-gray-100 transition-colors p-2 rounded-lg"
                        >
                            <Icon name="chat" className="text-2xl" />
                        </Link>
                    </div>
                </header>
                <main className="flex-grow flex p-4 overflow-x-auto space-x-4 min-h-0">
                    <SortableContext
                        items={filteredLists.map((list) => list._id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {/* Render các List (cột) */}
                        {filteredLists.map((list) => (
                            <ListComponent
                                key={list._id}
                                list={list}
                                onListDeleted={handleListDeleted}
                                onListTitleUpdated={handleListTitleUpdated}
                            />
                        ))}
                    </SortableContext>
                    {/* Component Thêm List Mới */}
                    <AddListForm onSaveList={handleSaveList} />
                </main>
            </div>

            <DragOverlay>
                {activeList ? <ListComponent list={activeList} onListDeleted={() => {}} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
