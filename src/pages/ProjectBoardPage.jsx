import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BoardView from '../components/boards/BoardView';
import TaskModal from '../components/boards/TaskModal';
import * as projectService from '../services/projectService';
import * as listService from '../services/listService';
import * as taskService from '../services/taskService';

const ProjectBoardPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedListId, setSelectedListId] = useState(null);
    const [isFormLoading, setIsFormLoading] = useState(false);

    // Fetch project and lists
    const fetchBoardData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [projectResponse, listsResponse] = await Promise.all([
                projectService.getProjectById(projectId),
                listService.getProjectLists(projectId),
            ]);

            // Debug logging - always log to help troubleshoot
            console.log('fetchBoardData - projectResponse:', projectResponse);
            console.log('fetchBoardData - listsResponse:', listsResponse);
            console.log('fetchBoardData - listsResponse type:', typeof listsResponse);
            console.log('fetchBoardData - isArray(listsResponse):', Array.isArray(listsResponse));

            // getProjectById returns { success: true, data: ... }
            const projectData = projectResponse?.data || projectResponse;
            setProject(projectData);

            // getProjectLists should return array directly
            if (Array.isArray(listsResponse)) {
                console.log('fetchBoardData - Setting lists, count:', listsResponse.length);
                setLists(listsResponse);
            } else {
                console.warn('fetchBoardData - listsResponse is not an array:', listsResponse);
                setLists([]);
            }
        } catch (error) {
            console.error('Error fetching board data:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi tải dữ liệu board');
            navigate('/projects');
        } finally {
            setIsLoading(false);
        }
    }, [projectId, navigate]);

    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    // Handle drag and drop
    const handleDragEnd = async (result) => {
        const { destination, source, type, draggableId } = result;

        // If dropped outside droppable area
        if (!destination) return;

        // If dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index && type === 'TASK') {
            return;
        }

        try {
            if (type === 'LIST') {
                // Reorder lists
                const newLists = Array.from(lists);
                const [removed] = newLists.splice(source.index, 1);
                newLists.splice(destination.index, 0, removed);

                // Update positions
                const listOrders = newLists.map((list, index) => ({
                    listId: list._id,
                    position: index,
                }));

                // Optimistic update
                setLists(newLists);

                // API call - returns array of lists
                const updatedLists = await listService.reorderLists(projectId, listOrders);
                if (Array.isArray(updatedLists)) {
                    setLists(updatedLists);
                }
                toast.success('Sắp xếp lists thành công');
            } else if (type === 'TASK') {
                const sourceListId = source.droppableId.replace('list-', '');
                const destListId = destination.droppableId.replace('list-', '');

                // Find source and destination lists
                const sourceList = lists.find((l) => l._id === sourceListId);
                const destList = lists.find((l) => l._id === destListId);

                if (!sourceList || !destList) return;

                const taskId = draggableId.replace('task-', '');
                const task = sourceList.tasks.find((t) => t._id === taskId);

                if (!task) return;

                // Same list - reorder tasks
                if (sourceListId === destListId) {
                    const newTasks = Array.from(sourceList.tasks);
                    const [removed] = newTasks.splice(source.index, 1);
                    newTasks.splice(destination.index, 0, removed);

                    // Update local state
                    const newLists = lists.map((list) =>
                        list._id === sourceListId ? { ...list, tasks: newTasks } : list,
                    );
                    setLists(newLists);

                    // Update positions
                    const taskOrders = newTasks.map((t, index) => ({
                        taskId: t._id,
                        position: index,
                    }));

                    // API call
                    await taskService.reorderTasks(sourceListId, taskOrders);
                    toast.success('Sắp xếp tasks thành công');
                } else {
                    // Different lists - move task
                    const sourceTasks = sourceList.tasks.filter((t) => t._id !== taskId);
                    const destTasks = Array.from(destList.tasks);
                    destTasks.splice(destination.index, 0, task);

                    // Update local state
                    const newLists = lists.map((list) => {
                        if (list._id === sourceListId) {
                            return { ...list, tasks: sourceTasks };
                        }
                        if (list._id === destListId) {
                            return { ...list, tasks: destTasks };
                        }
                        return list;
                    });
                    setLists(newLists);

                    // API call
                    await taskService.moveTask(taskId, destListId, destination.index);
                    toast.success('Di chuyển task thành công');
                }
            }
        } catch (error) {
            console.error('Error handling drag and drop:', error);
            toast.error(error.message || 'Có lỗi xảy ra');
            // Rollback by refetching
            fetchBoardData();
        }
    };

    // List handlers
    const handleAddList = async (data) => {
        try {
            setIsFormLoading(true);
            const newList = await listService.createList(projectId, data);
            // Service now returns the list object directly
            if (newList) {
                setLists([...lists, newList]);
            }
            toast.success('Tạo list thành công');
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi tạo list');
            throw error;
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleEditList = async (list, newData) => {
        try {
            setIsFormLoading(true);
            const updatedList = await listService.updateList(list._id, newData);
            // Service now returns the updated list object directly
            if (updatedList) {
                setLists(lists.map((l) => (l._id === list._id ? updatedList : l)));
            } else {
                // Fallback to local update if response doesn't have expected structure
                setLists(
                    lists.map((l) =>
                        l._id === list._id ? { ...l, ...newData, title: newData.name || newData.title } : l,
                    ),
                );
            }
            toast.success('Cập nhật list thành công');
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi cập nhật list');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleDeleteList = async (list) => {
        try {
            setIsFormLoading(true);
            await listService.deleteList(list._id);
            setLists(lists.filter((l) => l._id !== list._id));
            toast.success('Xóa list thành công');
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi xóa list');
        } finally {
            setIsFormLoading(false);
        }
    };

    // Task handlers
    const handleAddTask = async (listId, data) => {
        try {
            setIsFormLoading(true);
            const response = await taskService.createTask(listId, data);
            // Service returns { success: true, data: ... }
            const newTask = response?.data || response;
            setLists(
                lists.map((list) =>
                    list._id === listId ? { ...list, tasks: [...(list.tasks || []), newTask] } : list,
                ),
            );
            toast.success('Tạo task thành công');
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi tạo task');
            throw error;
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleEditTaskClick = (task) => {
        // Find which list this task belongs to
        const parentList = lists.find((list) => list.tasks?.some((t) => t._id === task._id));
        setSelectedListId(parentList?._id);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (data) => {
        try {
            setIsFormLoading(true);
            if (selectedTask) {
                // Update existing task
                const response = await taskService.updateTask(selectedTask._id, data);
                // Service returns { success: true, data: ... }
                const updatedTask = response?.data || response;
                setLists(
                    lists.map((list) => ({
                        ...list,
                        tasks: list.tasks?.map((t) => (t._id === selectedTask._id ? updatedTask : t)),
                    })),
                );
                toast.success('Cập nhật task thành công');
            } else if (selectedListId) {
                // Create new task
                await handleAddTask(selectedListId, data);
            }
            setIsModalOpen(false);
            setSelectedTask(null);
            setSelectedListId(null);
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleDeleteTask = async (task) => {
        try {
            setIsFormLoading(true);
            await taskService.deleteTask(task._id);
            setLists(
                lists.map((list) => ({
                    ...list,
                    tasks: list.tasks?.filter((t) => t._id !== task._id),
                })),
            );
            toast.success('Xóa task thành công');
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi xóa task');
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleOpenNewTaskModal = (listId) => {
        setSelectedListId(listId);
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải board...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/projects')}
                                className="text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                <span>Quay lại danh sách dự án</span>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">{project?.project_name || 'Board'}</h1>
                            {project?.description && (
                                <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Board Content */}
            <BoardView
                lists={lists}
                onDragEnd={handleDragEnd}
                onAddList={handleAddList}
                onEditList={(list) => {
                    const newName = window.prompt('Nhập tên list mới:', list.title);
                    if (newName && newName.trim() && newName !== list.title) {
                        handleEditList(list, { name: newName.trim() });
                    }
                }}
                onDeleteList={handleDeleteList}
                onAddTask={handleAddTask}
                onEditTask={handleEditTaskClick}
                onDeleteTask={handleDeleteTask}
                isLoading={isFormLoading}
            />

            {/* Task Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTask(null);
                    setSelectedListId(null);
                }}
                task={selectedTask}
                onSave={handleSaveTask}
                onDelete={selectedTask ? () => handleDeleteTask(selectedTask) : null}
                isLoading={isFormLoading}
            />
        </div>
    );
};

export default ProjectBoardPage;
