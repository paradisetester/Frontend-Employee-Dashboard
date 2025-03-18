import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import EditEmployee from './EditEmployee'; // Your existing edit modal component
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.getEmployees(); // Fetch employees from API
      setEmployees(response);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters.global.value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    try {
      await api.deleteEmployee(employeeToDelete._id); // Delete employee via API
      fetchEmployees(); // Refresh employee list
      setShowDeleteModal(false); // Close delete modal
      alert('Employee deleted successfully!');
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee. Please try again.');
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  // Body template for the department column (adds some styling)
  const departmentBodyTemplate = (rowData) => {
    return (
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
        {rowData.department}
      </span>
    );
  };

  // Body template for the actions column (edit & delete buttons)
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleEditClick(rowData)}
          title="Edit"
          className="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <FiEdit size={20} />
        </button>
        <button
          onClick={() => handleDeleteClick(rowData)}
          title="Delete"
          className="p-2 hover:bg-red-100 rounded-lg text-red-600 hover:text-red-700 transition-colors"
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees by name, email, position, or department..."
            value={globalFilterValue}
            onChange={handleSearchChange}
            className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <FiPlus size={20} />
          Add New Employee
        </button>
      </div>

      {/* PrimeReact DataTable */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <DataTable
          value={employees}
          paginator
          rows={5}
          removableSort
          filters={filters}
          columnResizeMode="expand"
          resizableColumns showGridlines 
          globalFilterFields={['name', 'email', 'position', 'department']}
          emptyMessage={`No employees found${globalFilterValue ? ` matching "${globalFilterValue}"` : ''}`}
          className="p-datatable-customers"
        >
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="position" header="Position" sortable />
          <Column field="department" header="Department" body={departmentBodyTemplate} sortable />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-pop-in">
            <div className="text-center mb-6">
              <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FiAlertTriangle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Employee</h3>
              <p className="text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-medium">{employeeToDelete?.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseDeleteModal}
                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={handleCloseEditModal}
          onSave={fetchEmployees}
        />
      )}
    </div>
  );
};

export default EmployeeList;
