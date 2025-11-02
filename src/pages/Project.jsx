// src/pages/ProjectPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ListComponent from '../components/listComponents/ListComponent';
import AddListForm from '../components/listComponents/AddListForm';
import { getListsByProject, createList } from '../services/listServices';
import Header from '../components/HeaderComponents/Header';
export default function ProjectPage() {
    const { projectId } = useParams();
    const [lists, setLists] = useState([]); // State này là một MẢNG (array)
    const [loading, setLoading] = useState(true);

    // Bước 1: Lấy tất cả list của project
    useEffect(() => {
        const fetchData = async () => {
            if (projectId) {
                setLoading(true);
                try {
                    const data = await getListsByProject(projectId);
                    setLists(data);
                } catch (error) {
                    console.error('Lỗi khi tải project:', error);
                    setLists([]);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [projectId]); // Phụ thuộc vào projectId là đúng

    // Bước 2: Hàm để thêm List (cột) mới
    const handleSaveList = async (title) => {
        const newList = await createList(projectId, title);
        setLists((prevLists) => [...prevLists, newList]);
    };
    const handleListDeleted = (deletedListId) => {
        setLists((prevLists) => prevLists.filter((list) => list._id !== deletedListId));
    };
    if (loading) return <div className="text-white">Đang tải project...</div>;

    return (
        // div cha: cao 100% màn hình, layout dọc
        <div className="flex flex-col w-screen h-screen bg-[#1a1a1a] text-white overflow-hidden">
            {/* Header (Bạn có thể thêm Navbar ở đây) */}
            <Header></Header>
            <header className="p-4 flex-shrink-0">
                <h1 className="text-2xl font-bold">Project: {projectId}</h1>
            </header>

            {/* SỬA DÒNG NÀY: 
        - Thêm 'flex-grow' để lấp đầy chiều cao còn lại.
        - Thêm 'min-h-0' để khắc phục lỗi overflow của flexbox.
      */}
            <main className="flex-grow flex p-4 overflow-x-auto space-x-4 min-h-0">
                {/* Render các List (cột) */}
                {lists.map((list) => (
                    <ListComponent
                        key={list._id} // Sửa: Dùng _id từ CSDL
                        list={list}
                        onListDeleted={handleListDeleted}
                    />
                ))}

                {/* Component Thêm List Mới */}
                <AddListForm onSaveList={handleSaveList} />
            </main>
        </div>
    );
}
