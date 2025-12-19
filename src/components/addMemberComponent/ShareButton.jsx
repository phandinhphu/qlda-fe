import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AddMemberForm from './AddMemberForm';

export default function ShareButton({ projectId }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors text-sm font-medium"
            >
                <UserPlus className="w-4 h-4" />
                <span>Chia sẻ</span>
            </button>

            {open && <AddMemberForm projectId={projectId} onClose={() => setOpen(false)} />}
        </>
    );
}
