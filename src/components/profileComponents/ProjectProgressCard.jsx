import React from 'react';
import { Link } from 'react-router-dom';
export default function ProjectProgressCard({ project }) {
    const cleanPercentage = Math.min(Math.max(project.percentage, 0), 100);
    console.log('Rendering ProjectProgressCard with project:', project);
    return (
        <Link
            to="/projects/{project._id}"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300"
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-800 truncate">{project.project_name}</span>
                <span className="text-sm font-medium text-blue-600">{project.percentage}%</span>
            </div>
            {/* //Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${cleanPercentage}%` }}
                ></div>
            </div>
            <span className="text-xs text-gray-400 mt-1 block">
                {project.doneTasks} / {project.totalTasks} task
            </span>
        </Link>
    );
}
