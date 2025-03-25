// src/components/ProjectList.js
import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import AddProject from './AddProject';
import ProjectModal from './ProjectModal';
import { getToken } from '../../services/authService';
import {jwtDecode} from 'jwt-decode'; // Note: jwtDecode is typically a default export

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState(null); // New state to store the user role
  const projectsPerPage = 5;

  // Fetch user token and decode role
  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        console.error('No token provided');
        return;
      }
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role); // Store role in state
        console.log('User role:', decodedToken.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch tasks for a specific project
  const fetchTasksForProject = async (project) => {
    // setLoading(true);   // Remove setLoading(true) to prevent loading state from showing
    try {
      const response = await api.getTasks();
      const allTasks = response || [];
      const filteredTasks = allTasks.filter(
        (task) => task.project?._id === project._id
      );

      setTasks(filteredTasks);
      setSelectedProject(project);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => setShowAddProject(true);

  const handleProjectAdded = () => {
    setShowAddProject(false);
    fetchProjects();
  };

  const handleCancelAddProject = () => {
    setShowAddProject(false);
  };

  const handleOpenModal = (project) => fetchTasksForProject(project);

  const handleCloseModal = () => {
    setSelectedProject(null);
    setTasks([]);
  };

  // Search Functionality
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Project List</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-1"
          />
          <button
            onClick={handleAddProject}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add New Project
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-4">Loading projects...</div>
      ) : showAddProject ? (
        // Show AddProject when showAddProject is true
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Add New Project</h2>
          {(role === 'admin' || role === 'manager') ? (
            <AddProject
              onProjectAdded={handleProjectAdded}
              onCancel={handleCancelAddProject}
            />
          ) : (
            <p>You do not have permission to add a new project.</p>
          )}
        </div>
      ) : (
        <>
          {/* Projects Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Manager</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Start Date</th>
                  <th className="px-6 py-3 text-left">End Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-gray-50 text-gray-700 border-b"
                  >
                    <td className="px-6 py-3">{project.name}</td>
                    <td className="px-6 py-3">
                      {project.manager?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-3">{project.status}</td>
                    <td className="px-6 py-3">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-3">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleOpenModal(project)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Previous
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          tasks={tasks}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProjectList;
