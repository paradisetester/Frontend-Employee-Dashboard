import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/axios';
import AddTask from './AddTask';
import SingleTaskPage from './SingleTaskPage';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const MyTasks = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [showAddTask, setShowAddTask] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const fetchTasks = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error('No token provided');
            }
            const decodedToken = jwtDecode(token);
            const employeeId = decodedToken.id;
            const taskData = await api.myTasks(employeeId);
            setTasks(taskData);
            console.log('taskData:', taskData);
            const projects = await api.getProjects();
            setProjects(projects);
        } catch (err) {
            console.error('Fetch Tasks Error:', err.message);
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Group tasks by status (case-insensitive comparison)
    const pendingTasks = tasks.filter(
        (task) => task.status?.toLowerCase() === 'pending'
    );
    const inProgressTasks = tasks.filter(
        (task) => task.status?.toLowerCase() === 'in progress'
    );
    const completedTasks = tasks.filter(
        (task) => task.status?.toLowerCase() === 'completed'
    );

    // Helper to render a section of tasks. Clicking a task sets selectedTaskId.
    const renderTaskSection = (title, taskArray, statusClass) => (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {title} ◾️ {taskArray.length} tasks
            </h2>
            {taskArray.length === 0 ? (
                <p className="text-gray-600">No tasks in this category.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {taskArray.map((task) => (
                        <div
                            key={task._id}
                            onClick={() => setSelectedTaskId(task._id)}
                            className="cursor-pointer bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                                <span
                                    className={`text-xs font-bold uppercase px-2 py-1 rounded ${statusClass}`}
                                >
                                    {task.status}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-500 text-xs">
                                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                                <div>
                                    <span className="font-medium text-gray-700">Due Date:</span>{' '}
                                    {task?.dueDate || 'N/A'}
                                </div>
                            </div>
                            <div className="flex justify-between text-gray-500 text-xs">
                                <div>
                                    <span className="font-medium text-gray-700">Project:</span>{' '}
                                    {task.project?.name || task.project || 'N/A'}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Assigned To:</span>{' '}
                                    {task.assignedTo?.name || 'N/A'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // If a task is selected, render the SingleTaskPage component.
    if (selectedTaskId) {
        return (
            <SingleTaskPage
                taskId={selectedTaskId}
                onBack={() => setSelectedTaskId(null)}
                onTaskUpdated={fetchTasks}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
                <button
                    onClick={() => setShowAddTask(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    + Add Task
                </button>
            </div>

            {loading ? (
                <div className="text-center text-lg text-gray-600">Loading tasks...</div>
            ) : error ? (
                <div className="text-center text-lg text-red-500">{error}</div>
            ) : tasks.length === 0 ? (
                // Display a more polished empty state if no tasks exist
                <div className="flex flex-col items-center justify-center py-20">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">No Tasks Available</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        You currently have no tasks assigned. Click the "Add Task" button to create one.
                    </p>
                    <button
                        onClick={() => setShowAddTask(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        + Add Task
                    </button>
                </div>
            ) : (
                <>
                    {renderTaskSection(
                        'Pending Tasks',
                        pendingTasks,
                        'bg-yellow-500 text-white'
                    )}
                    {renderTaskSection(
                        'In Progress Tasks',
                        inProgressTasks,
                        'bg-blue-500 text-white'
                    )}
                    {renderTaskSection(
                        'Completed Tasks',
                        completedTasks,
                        'bg-green-500 text-white'
                    )}
                </>
            )}

            {showAddTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative">
                        <button
                            className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-gray-800"
                            onClick={() => setShowAddTask(false)}
                        >
                            &times;
                        </button>
                        <AddTask 
                        onTaskAdded={fetchTasks}
                        projects={projects} 
                        onCancel={() => setShowAddTask(false)}  
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTasks;
