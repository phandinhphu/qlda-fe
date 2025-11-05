export default function ListMember({ title, members, active, onAdd }) {
    return (
        <div className="mt-4 border-t border-gray-200 pt-3">
            {active && (
                <div>
                    <h3 className="text-sm font-semibold mb-2">{title}</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {members.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">Không có dữ liệu.</p>
                        ) : (
                            members.map((m) => (
                                <li
                                    key={m._id}
                                    className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-sm font-bold text-gray-700">
                                                {m.name?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{m.name}</p>
                                            <p className="text-xs text-gray-500">{m.email}</p>
                                        </div>
                                    </div>
                                    {!m.role && (
                                        <button
                                            onClick={() => onAdd(m._id)}
                                            className="bg-gray-200 hover:bg-green-500
                                                        text-gray-500 hover:text-gray-700 
                                                        text-lg font-bold leading-none
                                                        transition"
                                        >
                                            + Thêm
                                        </button>
                                    )}
                                    {m.role && <span className="text-sm text-gray-600">{m.role}</span>}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
