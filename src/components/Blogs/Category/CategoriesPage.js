import React, { useEffect, useState } from 'react';
import api from '../../../services/axios';
import CategoryRow from './CategoryRow'; // Adjust the import path as needed

const CategoriesPage = () => {
  // State for category list and its loading/error status.
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // State for create category form.
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Fetch categories when the component mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const data = await api.getCategories();
        console.log(data);
        const fetchedCategories = Array.isArray(data)
          ? data
          : data.categories || [];
        setCategories(fetchedCategories);
      } catch (err) {
        setFetchError('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Submit handler for creating a new category.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    try {
      const categoryData = { name, description };
      const data = await api.addCategory(categoryData);
      if (data && data.message) {
        setCreateSuccess(data.message);
      } else {
        setCreateSuccess('Category created successfully!');
      }
      // Refresh the categories list.
      const updatedData = await api.getCategories();
      const fetchedCategories = Array.isArray(updatedData)
        ? updatedData
        : updatedData.categories || [];
      setCategories(fetchedCategories);
      // Clear the form.
      setName('');
      setDescription('');
    } catch (err) {
      setCreateError('Failed to create category.');
    }
  };

  // Callback to update a category
  const handleUpdateCategory = async (id, updatedData) => {
    await api.updateCategory(id, updatedData);
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
    );
  };

  // Callback to delete a category
  const handleDeleteCategory = async (_id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        console.log('Category deleted successfully!', _id);
        await api.deleteCategory(_id);
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat._id !== _id)
        );
      } catch (err) {
        alert('Failed to delete category.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Categories List */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          {loading ? (
            <p>Loading...</p>
          ) : fetchError ? (
            <p className="text-red-500">{fetchError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">Description</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <CategoryRow
                        key={category.id || index}
                        category={category}
                        onUpdate={handleUpdateCategory}
                        onDelete={handleDeleteCategory}
                      />
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 px-4" colSpan="3">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Create Category Form */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
          {createError && <p className="mb-4 text-red-500">{createError}</p>}
          {createSuccess && <p className="mb-4 text-green-500">{createSuccess}</p>}
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Category Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Category Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
