export default function TaskCheckbox({ checked, onChange }) {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            onClick={(e) => e.stopPropagation()} // Ngăn click lan sang TaskCard
            className={`
                mr-2 w-4 h-4 cursor-pointer appearance-none rounded
                border border-gray-400
                transition-all duration-150
                ${
                    checked
                        ? 'bg-green-500 border-green-500 before:content-["✔"] before:text-white before:text-xs before:flex before:items-center before:justify-center'
                        : 'bg-gray-100 hover:bg-gray-200'
                }
            `}
        />
    );
}
