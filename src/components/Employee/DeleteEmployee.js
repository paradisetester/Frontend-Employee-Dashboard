import React from 'react';

const DeleteEmployee = ({ onDelete, onCancel }) => (
  <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
      <p>Are you sure you want to delete this employee?</p>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteEmployee;
