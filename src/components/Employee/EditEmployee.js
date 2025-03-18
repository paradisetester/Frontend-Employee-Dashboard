import React, { useState } from 'react';
import api from '../../services/axios';

const EditEmployee = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...employee });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    const validationErrors = {};
    if (!formData.name) validationErrors.name = 'Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'Valid email is required.';
    if (!formData.age || formData.age < 18) validationErrors.age = 'Age must be 18 or older.';
    if (formData.salary <= 0) validationErrors.salary = 'Salary must be a positive number.';
    if (!formData.position) validationErrors.position = 'Position is required.';
    if (!formData.department) validationErrors.department = 'Department is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSaving(false);
      return;
    }

    try {
      const updatedEmployee = await api.updateEmployee(employee._id, formData);
      onSave(updatedEmployee);
      alert('Employee updated successfully!');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Edit Employee</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Age */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
              min="18"
            />
            {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
          </div>

          {/* Salary */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className={`w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
            />
            {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary}</p>}
          </div>

          {/* Position */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position}</p>}
          </div>

          {/* Department */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full p-4 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
  