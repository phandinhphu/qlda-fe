import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ListColumn from './ListColumn';
import AddListButton from './AddListButton';

const BoardView = ({
    lists,
    onDragEnd,
    onAddList,
    onEditList,
    onDeleteList,
    onAddTask,
    onEditTask,
    onDeleteTask,
    isLoading = false,
}) => {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" direction="horizontal" type="LIST">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-200px)] ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : ''
                        }`}
                    >
                        {lists && lists.length > 0 ? (
                            lists.map((list, index) => (
                                <ListColumn
                                    key={list._id}
                                    list={list}
                                    index={index}
                                    onEditList={onEditList}
                                    onDeleteList={onDeleteList}
                                    onEditTask={onEditTask}
                                    onDeleteTask={onDeleteTask}
                                    onAddTask={onAddTask}
                                    isLoading={isLoading}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p className="mb-4">Chưa có lists nào. Hãy tạo list đầu tiên!</p>
                            </div>
                        )}
                        {provided.placeholder}
                        <div className="flex-shrink-0">
                            <AddListButton onAdd={onAddList} isLoading={isLoading} />
                        </div>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default BoardView;
