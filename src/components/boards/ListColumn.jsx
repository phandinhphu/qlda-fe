import { Draggable, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import ListHeader from './ListHeader';
import AddTaskButton from './AddTaskButton';

const ListColumn = ({
    list,
    index,
    onEditList,
    onDeleteList,
    onEditTask,
    onDeleteTask,
    onAddTask,
    isLoading = false,
}) => {
    return (
        <Draggable draggableId={`list-${list._id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px] flex flex-col h-fit ${
                        snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                    }`}
                >
                    {/* Header with drag handle */}
                    <div {...provided.dragHandleProps}>
                        <ListHeader list={list} onEdit={onEditList} onDelete={onDeleteList} isLoading={isLoading} />
                    </div>

                    {/* Tasks Container with Droppable */}
                    <Droppable droppableId={`list-${list._id}`} type="TASK">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 min-h-[100px] max-h-[calc(100vh-300px)] overflow-y-auto space-y-2 mb-3 ${
                                    snapshot.isDraggingOver ? 'bg-blue-50 rounded' : ''
                                }`}
                            >
                                {list.tasks && list.tasks.length > 0 ? (
                                    list.tasks.map((task, taskIndex) => (
                                        <Draggable key={task._id} draggableId={`task-${task._id}`} index={taskIndex}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={snapshot.isDragging ? 'opacity-50' : ''}
                                                >
                                                    <TaskCard
                                                        task={task}
                                                        onUpdate={onAddTask} // Refresh after update
                                                        onEdit={onEditTask}
                                                        onDelete={onDeleteTask}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        {snapshot.isDraggingOver ? 'Thả task vào đây' : 'Không có tasks'}
                                    </div>
                                )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* Add Task Button */}
                    <AddTaskButton onAdd={(data) => onAddTask(list._id, data)} isLoading={isLoading} />
                </div>
            )}
        </Draggable>
    );
};

export default ListColumn;
