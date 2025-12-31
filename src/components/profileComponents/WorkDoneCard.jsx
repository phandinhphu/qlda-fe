import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import * as statsService from '../../services/userServices'; // Import service
import Spinner from '../Spinner';

function RainbowGradient() {
    const gradientId = 'rainbowGradient';
    const colors = [
        { offset: '100%', color: '#3c75cbff' }, // Tím
    ];

    return (
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id={gradientId} gradientTransform="rotate(90)">
                    {colors.map((color, index) => (
                        <stop key={index} offset={color.offset} stopColor={color.color} />
                    ))}
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function WorkDoneCard() {
    const [stats, setStats] = useState({ totalTasks: 0, todoTasks: 0, percentage: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await statsService.getUserStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Thống kê công việc</h2>
                <span className="text-sm text-gray-500">
                    {stats.totalTasks - stats.todoTasks} / {stats.totalTasks} task
                </span>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Spinner />
                </div>
            ) : (
                <div className="flex justify-center items-center my-6">
                    {/* 2. Sử dụng Component biểu đồ */}
                    <div style={{ width: 160, height: 160 }}>
                        <RainbowGradient />
                        <CircularProgressbar
                            value={stats.percentage} // Giá trị % hoàn thành
                            text={`${stats.percentage}%`} // Text hiển thị ở giữa
                            styles={buildStyles({
                                // Màu sắc
                                rotation: 0.25,
                                strokeLinecap: 'round',
                                textSize: '1.25rem', // Kích thước text
                                pathTransitionDuration: 0.5,
                                pathColor: `url(#rainbowGradient)`,
                                textColor: '#1F2937', // text-gray-800
                                trailColor: '#E5E7EB', // Nền (vòng mờ) - gray-200
                                backgroundColor: '#3e98c7',
                            })}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
