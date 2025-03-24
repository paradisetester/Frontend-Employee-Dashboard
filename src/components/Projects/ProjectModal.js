// src/components/ProjectModal.js
import React, { useState } from 'react';

const ProjectModal = ({ project, tasks, onClose }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'tasks'
  console.log(project, 'project');
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-blue-100">
          <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 w-1/2 text-center ${activeTab === 'details' ? 'bg-blue-500 text-white font-semibold' : 'bg-gray-100'
              }`}
          >
            Project Details
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 w-1/2 text-center ${activeTab === 'tasks' ? 'bg-blue-500 text-white font-semibold' : 'bg-gray-100'
              }`}
          >
            Tasks
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'details' ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Project Overview</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <p><strong>Manager:</strong> {project.manager?.name || 'N/A'}</p>
                <p><strong>Status:</strong> {project.status}</p>
                <p><strong>Category:</strong> {project.category || 'N/A'}</p>
                <p><strong>Email:</strong> {project.email || 'N/A'}</p>
                <p><strong>Start Date:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Assigned To:</strong> {project.assignedto && project.assignedto.length > 0
                  ? project.assignedto.map(user => user.name).join(', ')
                  : 'N/A'}</p>
                <p><strong>Created At:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700">Description</h4>
                <p className="text-gray-600 mt-2">{project.description || 'No description provided.'}</p>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Tasks</h3>
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <h4 className="font-semibold text-gray-700">{task.title}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-gray-600 text-sm">
                        <p><strong>Status:</strong> {task.status}</p>
                        <p><strong>Type:</strong> {task.type || 'N/A'}</p>
                        <p><strong>Department:</strong> {task.required_department || 'N/A'}</p>
                        <p><strong>Assigned To:</strong> {task.assignedTo?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> {task.assignedTo?.email || 'N/A'}</p>
                        <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="mt-2">
                        <p><strong>Description:</strong> {task.description || 'No description provided.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tasks available for this project.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
