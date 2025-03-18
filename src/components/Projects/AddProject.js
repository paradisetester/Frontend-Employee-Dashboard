import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/axios';
import { EmployeeContext } from '../context/EmployeeContext';

const AddProject = ({ onProjectAdded, onCancel }) => {
  const { employees } = useContext(EmployeeContext);
  const [managers, setManagers] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const [formData, setFormData] = useState({
    project: '',
    name: '',
    category: '',
    description: '',
    email: '',
    manager: '',
    assignedto: [],
    startDate: '',
    endDate: '',
    status: 'Planned',
  });

  useEffect(() => {
    if (employees.length > 0) {
      setManagers(employees.filter((emp) => emp.role === 'manager'));
      setAssignedEmployees(
        employees.filter(
          (emp) => !['manager', 'admin', 'hr'].includes(emp.role)
        )
      );
    }
  }, [employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssignedToChange = (e) => {
    const { options } = e.target;
    const selectedOptions = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData({ ...formData, assignedto: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.newProject(formData);
      onProjectAdded();
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="project"
              placeholder="Project Code"
              value={formData.project}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            >
              <option value="">Select Manager</option>
              {managers.map((mgr) => (
                <option key={mgr._id} value={mgr._id}>
                  {mgr.name}
                </option>
              ))}
            </select>
            <select
              name="assignedto"
              multiple
              value={formData.assignedto}
              onChange={handleAssignedToChange}
              className="border p-2 rounded"
            >
              {assignedEmployees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full mt-4"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
