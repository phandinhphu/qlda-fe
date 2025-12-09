import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskModalSteps from '../../components/listComponents/TaskModalSteps';
import * as taskServices from '../../services/taskServices';

// Mock taskServices
vi.mock('../../services/taskServices', () => ({
    addStep: vi.fn(),
    toggleStep: vi.fn(),
    getStepByTaskId: vi.fn(),
}));

describe('TaskModalSteps Component', () => {
    const mockTask = {
        _id: 'task-123',
        title: 'Test Task',
    };

    const mockOnUpdate = vi.fn();

    const mockSteps = [
        { _id: 'step-1', title: 'Step 1', is_completed: false },
        { _id: 'step-2', title: 'Step 2', is_completed: true },
        { _id: 'step-3', title: 'Step 3', is_completed: false },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        taskServices.getStepByTaskId.mockResolvedValue({ data: mockSteps });
    });

    describe('Rendering', () => {
        it('should render the component with title', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            expect(screen.getByText('Việc cần làm')).toBeInTheDocument();
        });

        it('should fetch and display steps on mount', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(taskServices.getStepByTaskId).toHaveBeenCalledWith(mockTask._id);
            });

            await waitFor(() => {
                expect(screen.getByText('Step 1')).toBeInTheDocument();
                expect(screen.getByText('Step 2')).toBeInTheDocument();
                expect(screen.getByText('Step 3')).toBeInTheDocument();
            });
        });

        it('should show add step button when form is not open', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('Thêm mô tả chi tiết...')).toBeInTheDocument();
            });
        });

        it('should show add step form when button is clicked', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            expect(screen.getByPlaceholderText('Thêm mô tả chi tiết...')).toBeInTheDocument();
            expect(screen.getByText('Thêm')).toBeInTheDocument();
            expect(screen.getByText('✕')).toBeInTheDocument();
        });
    });

    describe('Progress Bar', () => {
        it('should calculate and display correct progress percentage', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('Step 1')).toBeInTheDocument();
            });

            // 1 out of 3 steps completed = 33%
            const progressText = screen.getByText('33%');
            expect(progressText).toBeInTheDocument();
        });

        it('should display progress bar with correct width', async () => {
            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('Step 1')).toBeInTheDocument();
            });

            const progressBar = container.querySelector('.bg-green-500');
            expect(progressBar).toBeInTheDocument();
            expect(progressBar).toHaveStyle({ width: '33%' });
        });

        it('should not display progress bar when no steps exist', async () => {
            taskServices.getStepByTaskId.mockResolvedValue({ data: [] });
            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const progressBar = container.querySelector('.bg-green-500');
                expect(progressBar).not.toBeInTheDocument();
            });
        });

        it('should show 100% when all steps are completed', async () => {
            const allCompletedSteps = [
                { _id: 'step-1', title: 'Step 1', is_completed: true },
                { _id: 'step-2', title: 'Step 2', is_completed: true },
            ];
            taskServices.getStepByTaskId.mockResolvedValue({ data: allCompletedSteps });

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('100%')).toBeInTheDocument();
            });
        });

        it('should show 0% when no steps are completed', async () => {
            const noCompletedSteps = [
                { _id: 'step-1', title: 'Step 1', is_completed: false },
                { _id: 'step-2', title: 'Step 2', is_completed: false },
            ];
            taskServices.getStepByTaskId.mockResolvedValue({ data: noCompletedSteps });

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('0%')).toBeInTheDocument();
            });
        });
    });

    describe('Add Step', () => {
        it('should add a new step successfully', async () => {
            const newStep = { _id: 'step-4', title: 'New Step', is_completed: false };
            taskServices.addStep.mockResolvedValue(newStep);

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'New Step' } });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(taskServices.addStep).toHaveBeenCalledWith(mockTask._id, { title: 'New Step' });
                expect(mockOnUpdate).toHaveBeenCalled();
            });
        });

        it('should not add step with empty title', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            expect(taskServices.addStep).not.toHaveBeenCalled();
        });

        it('should not add step with whitespace-only title', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: '   ' } });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            expect(taskServices.addStep).not.toHaveBeenCalled();
        });

        it('should close form and clear input after successful add', async () => {
            const newStep = { _id: 'step-4', title: 'New Step', is_completed: false };
            taskServices.addStep.mockResolvedValue(newStep);

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'New Step' } });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Thêm mô tả chi tiết...')).toBeInTheDocument();
                expect(screen.queryByPlaceholderText('Thêm mô tả chi tiết...')).not.toBeInTheDocument();
            });
        });

        it('should handle add step error', async () => {
            taskServices.addStep.mockRejectedValue(new Error('API Error'));

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'New Step' } });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('API Error');
            });
        });

        it('should close form when cancel button is clicked', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'Some text' } });

            const cancelButton = screen.getByText('✕');
            fireEvent.click(cancelButton);

            expect(screen.queryByPlaceholderText('Thêm mô tả chi tiết...')).not.toBeInTheDocument();
            expect(screen.getByText('Thêm mô tả chi tiết...')).toBeInTheDocument();
        });

        it('should submit step when Enter key is pressed without Shift', async () => {
            const newStep = { _id: 'step-4', title: 'New Step', is_completed: false };
            taskServices.addStep.mockResolvedValue(newStep);

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'New Step' } });
            fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

            await waitFor(() => {
                expect(taskServices.addStep).toHaveBeenCalledWith(mockTask._id, { title: 'New Step' });
            });
        });

        it('should close form when Escape key is pressed', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'Some text' } });
            fireEvent.keyDown(textarea, { key: 'Escape' });

            expect(screen.queryByPlaceholderText('Thêm mô tả chi tiết...')).not.toBeInTheDocument();
        });
    });

    describe('Toggle Step', () => {
        it('should toggle step completion status', async () => {
            const updatedStep = { _id: 'step-1', title: 'Step 1', is_completed: true };
            taskServices.toggleStep.mockResolvedValue({ data: updatedStep });

            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('Step 1')).toBeInTheDocument();
            });

            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            const firstCheckbox = checkboxes[0];

            fireEvent.click(firstCheckbox);

            await waitFor(() => {
                expect(taskServices.toggleStep).toHaveBeenCalledWith('step-1', mockTask._id);
                expect(mockOnUpdate).toHaveBeenCalled();
            });
        });

        it('should update progress when step is toggled', async () => {
            const updatedStep = { _id: 'step-1', title: 'Step 1', is_completed: true };
            taskServices.toggleStep.mockResolvedValue({ data: updatedStep });

            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('33%')).toBeInTheDocument();
            });

            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            fireEvent.click(checkboxes[0]);

            await waitFor(() => {
                expect(screen.getByText('67%')).toBeInTheDocument();
            });
        });

        it('should handle toggle step error', async () => {
            taskServices.toggleStep.mockRejectedValue(new Error('Toggle Error'));

            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('Step 1')).toBeInTheDocument();
            });

            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            fireEvent.click(checkboxes[0]);

            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Toggle Error');
            });
        });

        it('should apply line-through style to completed steps', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const completedStepText = screen.getByText('Step 2').closest('span');
                expect(completedStepText).toHaveClass('line-through');
                expect(completedStepText).toHaveClass('text-gray-400');
            });
        });

        it('should not apply line-through style to incomplete steps', async () => {
            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const incompleteStepText = screen.getByText('Step 1').closest('span');
                expect(incompleteStepText).not.toHaveClass('line-through');
                expect(incompleteStepText).toHaveClass('text-gray-700');
            });
        });

        it('should check checkbox for completed steps', async () => {
            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('Step 2')).toBeInTheDocument();
            });

            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            expect(checkboxes[1]).toBeChecked(); // Step 2 is completed
            expect(checkboxes[0]).not.toBeChecked(); // Step 1 is not completed
            expect(checkboxes[2]).not.toBeChecked(); // Step 3 is not completed
        });
    });

    describe('Progress Bar Updates', () => {
        it('should update progress bar when adding new step', async () => {
            const newStep = { _id: 'step-4', title: 'New Step', is_completed: false };
            taskServices.addStep.mockResolvedValue(newStep);

            render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                expect(screen.getByText('33%')).toBeInTheDocument();
            });

            await waitFor(() => {
                const addButton = screen.getByText('Thêm mô tả chi tiết...');
                fireEvent.click(addButton);
            });

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'New Step' } });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            await waitFor(() => {
                // 1 completed out of 4 total = 25%
                expect(screen.getByText('25%')).toBeInTheDocument();
            });
        });

        it('should update progress bar style dynamically', async () => {
            const updatedStep = { _id: 'step-3', title: 'Step 3', is_completed: true };
            taskServices.toggleStep.mockResolvedValue({ data: updatedStep });

            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            await waitFor(() => {
                const progressBar = container.querySelector('.bg-green-500');
                expect(progressBar).toHaveStyle({ width: '33%' });
            });

            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            fireEvent.click(checkboxes[2]); // Toggle Step 3

            await waitFor(() => {
                const progressBar = container.querySelector('.bg-green-500');
                expect(progressBar).toHaveStyle({ width: '67%' });
            });
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete workflow: fetch, add, toggle steps', async () => {
            const newStep = { _id: 'step-4', title: 'New Step', is_completed: false };
            taskServices.addStep.mockResolvedValue(newStep);

            const toggledStep = { _id: 'step-4', title: 'New Step', is_completed: true };
            taskServices.toggleStep.mockResolvedValue({ data: toggledStep });

            const { container } = render(<TaskModalSteps task={mockTask} onUpdate={mockOnUpdate} />);

            // Wait for initial load
            await waitFor(() => {
                expect(screen.getByText('Step 1')).toBeInTheDocument();
                expect(screen.getByText('33%')).toBeInTheDocument();
            });

            // Add new step
            const addButton = screen.getByText('Thêm mô tả chi tiết...');
            fireEvent.click(addButton);

            const textarea = screen.getByPlaceholderText('Thêm mô tả chi tiết...');
            fireEvent.change(textarea, { target: { value: 'New Step' } });

            const submitButton = screen.getByText('Thêm');
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('New Step')).toBeInTheDocument();
                expect(screen.getByText('25%')).toBeInTheDocument();
            });

            // Toggle the new step
            const checkboxes = container.querySelectorAll('input[type="checkbox"]');
            fireEvent.click(checkboxes[3]); // The new step checkbox

            await waitFor(() => {
                expect(screen.getByText('50%')).toBeInTheDocument();
            });
        });
    });
});
