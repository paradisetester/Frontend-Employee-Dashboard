import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/axios';
import { EmployeeContext } from '../context/EmployeeContext';
const mongoose = require('mongoose');

const AddTask = ({ onTaskAdded, projects, initialData = null, onCancel }) => {
  const { employees } = useContext(EmployeeContext);
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  // Initialize form data with correct field names
  const [formData, setFormData] = useState({
    project: '',
    title: '',
    description: '',
    priority: 'Low',
    assignedTo: '',
    dueDate: '',
    status: 'Pending',
    type: '',
    required_department: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (employees.length > 0) {
      setAssignedEmployees(
        employees.filter(
          (emp) => !['hr'].includes(emp.role)
        )
      );
    }
  }, [employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure that 'project' and 'assignedTo' are valid ObjectIds
      if (!mongoose.Types.ObjectId.isValid(formData.project)) {
        alert('Invalid project ID');
        return;
      }
      if (!mongoose.Types.ObjectId.isValid(formData.assignedTo)) {
        alert('Invalid assigned employee ID');
        return;
      }

      // Handle empty dueDate: set to null if empty
      const taskData = { ...formData, dueDate: formData.dueDate ? new Date(formData.dueDate) : null };

      if (initialData) {
        // Update Task
        await api.updateTask(initialData._id, taskData);
        console.log('Task updated successfully!');
      } else {
        // Add New Task
        await api.newTask(taskData);
        console.log('Task added successfully!');
      }
      onTaskAdded();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Task Title */}
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      {/* Project Selector */}
      <select
        name="project"
        value={formData.project}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Select Project</option>
        {projects.map((proj) => (
          <option key={proj._id} value={proj._id}>
            {proj.name}
          </option>
        ))}
      </select>

      {/* Description */}
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      {/* Assigned Employee Selector */}
      <select
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="">Assign To</option>
        {assignedEmployees
          .filter((emp) => emp.role !== 'admin')  // Exclude employees with role "admin"
          .map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
      </select>


      {/* Other Fields */}
      <input
        type="text"
        name="type"
        placeholder="Task Type"
        value={formData.type}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        name="required_department"
        placeholder="Required Department"
        value={formData.required_department}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
        className="border p-2 rounded w-full"
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <div className="flex justify-between gap-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTask;
