export default function TaskCheckbox({ checked, onChange }) {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            onClick={(e) => e.stopPropagation()} // ngăn click lan sang task
            className="mr-2 accent-green-500 w-4 h-4 cursor-pointer"
        />
    );
}
