import React, { useState } from 'react';

const CategoryRow = ({ category, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(category.name);
  const [editingDescription, setEditingDescription] = useState(category.description);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      await onUpdate(category._id, { name: editingName, description: editingDescription });
      setSuccess('Category updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update category.');
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2 px-4 border-b border-gray-200">
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          category.name
        )}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        {isEditing ? (
          <textarea
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            rows="2"
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        ) : (
          category.description
        )}
      </td>
      <td className="py-2 px-4 border-b border-gray-200">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingName(category.name);
                setEditingDescription(category.description);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(category._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </td>
    </tr>
  );
};

export default CategoryRow;
