import { useEffect, useState } from 'react';
import { addStep, toggleStep, getStepByTaskId } from '../../services/taskServices';

const Icon = ({ name, className = '' }) => <span className={`material-icons ${className}`}>{name}</span>;

export default function TaskModalSteps({ task, onUpdate }) {
    const [showAddStep, setShowAddStep] = useState(false);
    const [newStepTitle, setNewStepTitle] = useState('');
    const [steps, setSteps] = useState([]);

    const totalSteps = steps.length;
    const completedSteps = steps.filter((step) => step.is_completed).length;
    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    useEffect(() => {
        const fetchSteps = async () => {
            try {
                const fetchedSteps = await getStepByTaskId(task._id);
                setSteps(fetchedSteps.data);
            } catch (error) {
                console.error('Error fetching steps:', error);
            }
        };

        fetchSteps();
    }, [task._id]);

    const handleAddStep = async () => {
        if (newStepTitle.trim() === '') return;

        try {
            const newStep = await addStep(task._id, { title: newStepTitle });
            const updatedSteps = [...steps, newStep];
            setSteps(updatedSteps);
            setNewStepTitle('');
            setShowAddStep(false);

            // Cập nhật task trong parent
            onUpdate({ ...task, steps: updatedSteps });
        } catch (error) {
            console.error('Error adding step:', error);
            alert(error.message);
        }
    };

    const handleToggleStep = async (stepId) => {
        try {
            // Tìm step hiện tại
            const currentStep = steps.find((s) => s._id === stepId);
            if (!currentStep) return;

            // Gọi API
            const updatedStep = await toggleStep(stepId, task._id);

            // Cập nhật state
            const updatedSteps = steps.map((s) => (s._id === stepId ? updatedStep.data : s));
            setSteps(updatedSteps);

            // Cập nhật task trong parent
            onUpdate({ ...task, steps: updatedSteps });
        } catch (error) {
            console.error('Error toggling step:', error);
            alert(error.message);
        }
    };

    return (
        <div className="bg-white rounded p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon name="checklist" className="text-gray-700" />
                    <h3 className="font-semibold text-gray-800">Việc cần làm</h3>
                </div>
                {totalSteps > 0 && <span className="text-sm font-medium text-gray-600">{progress}%</span>}
            </div>

            {/* Progress Bar */}
            {totalSteps > 0 && (
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Add Step Form */}
            {showAddStep ? (
                <div className="mb-3">
                    <textarea
                        value={newStepTitle}
                        onChange={(e) => setNewStepTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddStep();
                            }
                            if (e.key === 'Escape') {
                                setNewStepTitle('');
                                setShowAddStep(false);
                            }
                        }}
                        placeholder="Thêm mô tả chi tiết..."
                        className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-blue-400 mb-2 min-h-20 bg-white"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                            Thêm
                        </button>
                        <button
                            onClick={() => {
                                setNewStepTitle('');
                                setShowAddStep(false);
                            }}
                            className="text-gray-700 px-4 py-2 rounded text-sm transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddStep(true)}
                    className="w-full text-left text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 p-3 rounded mb-3 border border-gray-300"
                >
                    Thêm mô tả chi tiết...
                </button>
            )}

            {/* Steps List */}
            {totalSteps > 0 && (
                <div className="space-y-2">
                    {steps.map((step) => (
                        <div key={step._id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={step.is_completed}
                                onChange={() => handleToggleStep(step._id)}
                                className="w-4 h-4 mt-0.5 text-blue-500 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <span
                                className={`flex-1 text-sm ${
                                    step.is_completed ? 'line-through text-gray-400' : 'text-gray-700'
                                } text-start`}
                            >
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
