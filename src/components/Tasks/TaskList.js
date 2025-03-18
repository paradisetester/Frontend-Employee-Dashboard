import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/axios';
import AddTask from './AddTask';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [role, setRole] = useState(null); // New state to store the user role

  const tasksPerPage = 5;

  const fetchTasksAndProjects = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRes, projectRes] = await Promise.all([api.getTasks(), api.getProjects()]);
      setTasks(Array.isArray(taskRes) ? taskRes : []);
      setProjects(Array.isArray(projectRes) ? projectRes : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks or projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasksAndProjects();
  }, [fetchTasksAndProjects]);

  // // Fetch user token and decode role
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = getToken();
  //     if (!token) {
  //       console.error('No token provided');
  //       return;
  //     }
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       setRole(decodedToken.role); // Store role in state
  //       console.log('User role:', decodedToken.role);
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //     }
  //   };
  //   fetchUser();
  // }, []);
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (task.project?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          task.status.toLowerCase().includes(lowerCaseSearchTerm))
    );
    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [searchTerm, tasks]);

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const handleAddTask = () => {
    setEditTask(null);
    setShowAddTask(true);
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowAddTask(true);
  };

  const handleCloseModal = () => {
    setShowAddTask(false);
    setEditTask(null);
  };

  const handleTaskAddedOrUpdated = () => {
    handleCloseModal();
    fetchTasksAndProjects();
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await api.updateTask(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      handleTaskAddedOrUpdated();
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="flex justify-center items-center">Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Task List</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="border p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200"
            aria-label="Add new task"
          >
            Add Task
          </button>
        </div>
      </div>

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
              onTaskAdded={handleTaskAddedOrUpdated}
              onCancel={() => setShowAddTask(false)}  // Pass the cancel callback here
              projects={projects}
            />
          </div>
        </div>
      )}


      {currentTasks.length === 0 ? (
        <div className="text-gray-500">No tasks available right now.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-4 text-left">Title</th>
                <th className="border p-4 text-left">Project</th>
                <th className="border p-4 text-left">Assigned To</th>
                <th className="border p-4 text-left">Status</th>
                <th className="border p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTasks.length > tasksPerPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-gray-300 rounded-md disabled:bg-gray-200"
          >
            Previous
          </button>
          <span className="px-6 py-3">{`Page ${currentPage}`}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredTasks.length / tasksPerPage)}
            className="px-6 py-3 bg-gray-300 rounded-md disabled:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const TaskRow = React.memo(({ task, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="border p-4">{task.title}</td>
    <td className="border p-4">{task.project?.name || 'N/A'}</td>
    <td className="border p-4">{task.assignedTo?.name || 'N/A'}</td>
    <td className="border p-4">{task.status}</td>
    <td className="border p-4 flex gap-4 justify-center">
      <button
        onClick={() => onEdit(task)}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        aria-label={`Edit task: ${task.title}`}
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(task._id)}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        aria-label={`Delete task: ${task.title}`}
      >
        Delete
      </button>
    </td>
  </tr>
));

export default TaskList;
