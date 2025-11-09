// src/pages/ProjectPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ListComponent from '../components/listComponents/ListComponent';
import AddListForm from '../components/listComponents/AddListForm';
import { getListsByProject, createList, reorderLists } from '../services/listServices';
import { getProjectById } from '../services/projectService';
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

export default function ProjectPage() {
    const { projectId } = useParams();
    const [lists, setLists] = useState([]); // State này là một MẢNG (array)
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
    const [activeList, setActiveList] = useState(null);
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
                {/* Header (Bạn có thể thêm Navbar ở đây) */}
                <Header></Header>

                {/* 3. Thêm nền trắng và viền dưới cho header của Project */}
                <header className="p-4 flex items-center justify-between bg-white border-b border-gray-200">
                    <h1 className="text-2xl font-bold pl-4">{project.project_name}</h1>
                    <ShareButton projectId={project._id} />
                </header>

                {/* Vùng main (đã đúng) */}
                <main className="flex-grow flex p-4 overflow-x-auto space-x-4 min-h-0">
                    <SortableContext items={lists.map((list) => list._id)} strategy={horizontalListSortingStrategy}>
                        {/* Render các List (cột) */}
                        {lists.map((list) => (
                            <ListComponent key={list._id} list={list} onListDeleted={handleListDeleted} />
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
