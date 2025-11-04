import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AddMemberForm from './AddMemberForm';

export default function ShareButton({ projectId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
            >
                <UserPlus className="w-5 h-5" />
                <span>Chia sẻ</span>
            </button>

            {open && <AddMemberForm projectId={projectId} onClose={() => setOpen(false)} />}
        </>
    );
}
