import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2, ArrowLeft, X, Circle } from 'lucide-react';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showListModal, setShowListModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedList, setSelectedList] = useState(null);
    const [newListTitle, setNewListTitle] = useState('');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
    });

    useEffect(() => {
        fetchProject();
        fetchLists();
    }, [id]);

    const fetchProject = async () => {
        try {
            const data = await api.getProject(id);
            setProject(data);
        } catch (error) {
            console.error('Failed to fetch project:', error);
        }
    };

    const fetchLists = async () => {
        try {
            const data = await api.getLists(id);
            setLists(data);
        } catch (error) {
            console.error('Failed to fetch lists:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        try {
            await api.createList(id, { title: newListTitle });
            setShowListModal(false);
            setNewListTitle('');
            fetchLists();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!selectedList) return;
        try {
            await api.createTask(selectedList._id, newTask);
            setShowTaskModal(false);
            setSelectedList(null);
            setNewTask({ title: '', description: '', priority: 'medium' });
            fetchLists();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.deleteTask(taskId);
                fetchLists();
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { draggableId, destination, source } = result;
        const sourceListId = source.droppableId;
        const destListId = destination.droppableId;

        if (sourceListId === destListId) {
            // Reordering within same list
            return;
        }

        // Move task to new list
        try {
            await api.updateTask(draggableId, {
                list_id: destListId,
            });
            fetchLists();
        } catch (error) {
            console.error('Failed to move task:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{project?.project_name}</h1>
                                <p className="text-gray-600 text-sm">{project?.description || 'No description'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowListModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add List
                        </button>
                    </div>
                </div>
            </header>

            {/* Board */}
            <main className="overflow-x-auto px-4 py-8 pb-20">
                {lists.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No lists yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Create your first list to start organizing your tasks.
                        </p>
                        <button
                            onClick={() => setShowListModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Create First List
                        </button>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex gap-6 min-w-max pb-4">
                            {lists.map((list) => (
                                <Droppable key={list._id} droppableId={list._id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 min-w-[320px] max-w-[320px] flex flex-col shadow-lg border-2 transition-all ${
                                                snapshot.isDraggingOver
                                                    ? 'border-blue-400 bg-blue-50/50'
                                                    : 'border-gray-200'
                                            }`}
                                        >
                                            {/* List Header */}
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                                <h2 className="font-bold text-gray-800 text-lg">{list.title}</h2>
                                                <div className="text-sm text-gray-500">{list.tasks?.length || 0}</div>
                                            </div>

                                            {/* Tasks Container */}
                                            <div className="flex-1 space-y-3 min-h-[200px]">
                                                {list.tasks?.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-400">
                                                        <Circle className="w-8 h-8 mx-auto mb-2" />
                                                        <p className="text-sm">No tasks</p>
                                                    </div>
                                                ) : (
                                                    list.tasks?.map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border border-gray-100 ${
                                                                        snapshot.isDragging
                                                                            ? 'shadow-lg rotate-2 scale-105'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <h3 className="font-semibold text-gray-800 flex-1">
                                                                            {task.title}
                                                                        </h3>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteTask(task._id);
                                                                            }}
                                                                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all ml-2"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>

                                                                    {task.description && (
                                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                                            {task.description}
                                                                        </p>
                                                                    )}

                                                                    <div className="flex items-center gap-2">
                                                                        <span
                                                                            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                                                task.priority === 'high'
                                                                                    ? 'bg-red-100 text-red-700'
                                                                                    : task.priority === 'medium'
                                                                                      ? 'bg-yellow-100 text-yellow-700'
                                                                                      : 'bg-green-100 text-green-700'
                                                                            }`}
                                                                        >
                                                                            {task.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                )}
                                                {provided.placeholder}
                                            </div>

                                            {/* Add Task Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedList(list);
                                                    setShowTaskModal(true);
                                                }}
                                                className="mt-4 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2.5 rounded-xl transition-all duration-200 group"
                                            >
                                                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                                <span className="text-sm font-medium">Add Task</span>
                                            </button>
                                        </div>
                                    )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                )}
            </main>

            {/* Create List Modal */}
            {showListModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowListModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Create New List</h2>
                            </div>
                            <button
                                onClick={() => setShowListModal(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateList} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">List Name *</label>
                                <input
                                    type="text"
                                    value={newListTitle}
                                    onChange={(e) => setNewListTitle(e.target.value)}
                                    required
                                    placeholder="Enter list name..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                                >
                                    Create List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowListModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Task Modal */}
            {showTaskModal && selectedList && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        setShowTaskModal(false);
                        setSelectedList(null);
                    }}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
                                    <p className="text-sm text-gray-600">to {selectedList.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowTaskModal(false);
                                    setSelectedList(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
                                <input
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    placeholder="Enter task title..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Enter description (optional)..."
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                                >
                                    Create Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTaskModal(false);
                                        setSelectedList(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
