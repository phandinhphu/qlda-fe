export default function ListMember({ title, members, active, onAdd }) {
    return (
        <div className="mt-4 border-t border-gray-700 pt-3">
            {active && (
                <div>
                    <h3 className="text-sm font-semibold mb-2">{title}</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {members.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">Không có dữ liệu.</p>
                        ) : (
                            members.map((m) => (
                                <li key={m._id} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                            <span className="text-sm font-bold">
                                                {m.name?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{m.name}</p>
                                            <p className="text-xs text-gray-400">{m.email}</p>
                                        </div>
                                    </div>
                                    {/*nếu là danh sách tìm kiếm thì có nút thêm*/}
                                    {!m.role && <button onClick={() => onAdd(m._id)}>+ Thêm</button>}

                                    {/*danh sách thành viên thì hiển thị role*/}
                                    {m.role && <span className="text-sm text-gray-300">{m.role}</span>}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
