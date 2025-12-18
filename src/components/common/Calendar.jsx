import React from 'react';
import { DayPicker } from 'react-day-picker';
import { vi } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export default function Calendar({ selected, onSelect, className }) {
    return (
        <div className={`p-3 bg-white border rounded-lg shadow-sm ${className}`}>
            <DayPicker
                mode="single"
                selected={selected}
                onSelect={onSelect}
                locale={vi}
                modifiersClassNames={{
                    selected: 'bg-blue-600 text-white hover:bg-blue-600',
                    today: 'text-blue-600 font-bold',
                }}
                styles={{
                    day: { borderRadius: '8px' },
                }}
            />
        </div>
    );
}
