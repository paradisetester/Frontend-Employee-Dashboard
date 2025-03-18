import React, { useEffect, useState } from 'react';
import api from '../../services/axios';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const SingleTaskPage = ({ taskId, onBack, onTaskUpdated }) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('No token provided');
                }
                // Optionally decode token if needed
                jwtDecode(token);
                console.log(taskId, 'taskID');
                const response = await api.getTask(taskId);
                console.log(response, 'response');
                setTask(response);
                setStatus(response.status);
            } catch (err) {
                console.error('Error fetching task:', err.message);
                setError('Failed to load task.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setUpdateError('');
        try {
            // Create an updated task object by merging the existing task data with the new status.
            const updatedTask = { ...task, status };
            console.log(updatedTask, 'updatedTask');

            // Send the complete updated task data.
            await api.updateTask(taskId, updatedTask);

            // Update local state.
            setTask(updatedTask);

            // Notify parent component to refresh task list if needed.
            if (onTaskUpdated) onTaskUpdated();
        } catch (err) {
            console.error('Error updating task:', err.message);
            setUpdateError('Failed to update task.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-600">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
                <button
                    onClick={onBack}
                    className="mb-4 text-blue-600 hover:underline"
                >
                    &larr; Back to Tasks
                </button>
                <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
                <p className="text-gray-700 mb-4">{task.description}</p>

                <div className="mb-4 flex justify-between text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Project:</span>{' '}
                        {task.project?.name || task.project || 'N/A'}
                    </div>
                    <div>
                        <span className="font-medium">Assigned To:</span>{' '}
                        {task.assignedTo?.name || 'N/A'}
                    </div>
                </div>

                <div className="mb-6">
                    <span className="font-medium">Due Date:</span>{' '}
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Update Status
                        </label>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {updateError && (
                        <div className="text-red-500 text-sm">{updateError}</div>
                    )}

                    <button
                        type="submit"
                        disabled={updating}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        {updating ? 'Updating...' : 'Update Status'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SingleTaskPage;
