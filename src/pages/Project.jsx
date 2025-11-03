// src/pages/ProjectPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ListComponent from '../components/listComponents/ListComponent';
import AddListForm from '../components/listComponents/AddListForm';
import { getListsByProject, createList } from '../services/listServices';
import { getProjectById } from '../services/projectService';
import Header from '../components/HeaderComponents/Header';

export default function ProjectPage() {
    const { projectId } = useParams();
    const [lists, setLists] = useState([]); // State này là một MẢNG (array)
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    // ... (Phần logic useEffect và các hàm handlers giữ nguyên) ...
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

    // 1. Sửa màu chữ Loading
    if (loading) return <div className="text-gray-700 p-8">Đang tải project...</div>;

    return (
        // 2. Sửa nền (bg-gray-100) và màu chữ (text-gray-900)
        <div className="flex flex-col w-screen h-screen bg-gray-100 text-gray-900 overflow-hidden">
            {/* Header (Bạn có thể thêm Navbar ở đây) */}
            <Header></Header>

            {/* 3. Thêm nền trắng và viền dưới cho header của Project */}
            <header className="p-4 flex-shrink-0 bg-white border-b border-gray-200">
                <h1 className="text-2xl font-bold">{project.project_name}</h1>
            </header>

            {/* Vùng main (đã đúng) */}
            <main className="flex-grow flex p-4 overflow-x-auto space-x-4 min-h-0">
                {/* Render các List (cột) */}
                {lists.map((list) => (
                    <ListComponent key={list._id} list={list} onListDeleted={handleListDeleted} />
                ))}

                {/* Component Thêm List Mới */}
                <AddListForm onSaveList={handleSaveList} />
            </main>
        </div>
    );
}
