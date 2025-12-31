import { useEffect, useState } from 'react';
import { getTaskFiles } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function TaskModalAttachments({ taskId, newFile }) {
    const [files, setFiles] = useState([]);

    const loadFiles = async () => {
        const data = await getTaskFiles(taskId);
        setFiles(data.data);
    };

    useEffect(() => {
        loadFiles();
    }, [taskId]);

    useEffect(() => {
        if (newFile) {
            setFiles((prev) => [...prev, newFile]);
        }
    }, [newFile]);

    return (
        <div className="bg-white rounded p-4">
            <div className="flex items-center gap-2 mb-3">
                <Icon name="attach_file" className="text-gray-700" />
                <h3 className="font-semibold text-gray-800">Tập tin đính kèm</h3>
            </div>

            <div className="space-y-3">
                {files.length == 0 ? (
                    <div className="text-gray-500 text-sm">Chưa có tệp đính kèm</div>
                ) : (
                    files.map((file) => (
                        <div
                            key={file._id}
                            className="flex items-center justify-between bg-gray-100 border border-gray-300 p-3 rounded"
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-3 flex-1">
                                <Icon
                                    name={
                                        file.file_url.endsWith('.png') || file.file_url.endsWith('.jpg')
                                            ? 'image'
                                            : file.file_url.endsWith('.pdf')
                                              ? 'picture_as_pdf'
                                              : 'description'
                                    }
                                    className="text-gray-600"
                                />

                                <div className="flex flex-col">
                                    <a
                                        href={file.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-blue-600 hover:underline max-w-[180px] truncate"
                                    >
                                        {file.file_url.split('/').pop()}
                                    </a>
                                    <div className="text-xs text-gray-500">{file.uploaded_by.name}</div>
                                </div>
                            </div>

                            {/* DATE */}
                            <div className="text-xs text-gray-500 mr-3 whitespace-nowrap">
                                {formatDate(file.uploaded_at)}
                            </div>

                            {/* MENU */}
                            <button
                                className="text-gray-600 bg-gray-100 rounded-md px-2 py-1 text-sm transition"
                                onClick={() => console.log('open menu for file:', file._id)}
                            >
                                <span className="text-xl">⋯</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
