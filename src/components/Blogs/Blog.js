import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import { getToken } from '../../services/authService';
import { Editor } from 'primereact/editor';

const AddBlogPage = ({ onCancel }) => {
  // Form state for blog inputs.
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    limit: '',
    image: null,
  });
  // State for blog submission status.
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  // State for managing categories.
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  // Selected category id for adding the blog.
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories on component mount.
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const data = await api.getCategories();
        // Adjust based on API response structure.
        const fetchedCategories = Array.isArray(data)
          ? data
          : data.categories || [];
        setCategories(fetchedCategories);
      } catch (err) {
        setCategoriesError('Failed to fetch categories.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle input changes for text inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes for the Editor component.
  const handleContentChange = (e) => {
    setFormData((prev) => ({ ...prev, content: e.htmlValue }));
  };

  // Handle file input changes.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setStatus({ error: 'Only image files are allowed.' });
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    setStatus((prev) => ({ ...prev, error: null }));
  };

  // Reset form state.
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      limit: '',
      image: null,
    });
    setStatus({ loading: false, error: null, success: null });
    setSelectedCategory('');
    if (onCancel) onCancel();
  };

  // Submit the blog form and update the selected category.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    if (!formData.title.trim() || !formData.content.trim()) {
      setStatus({ error: 'Title and Content are required.', loading: false, success: null });
      return;
    }

    // Prepare FormData payload.
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('content', formData.content);
    if (formData.limit) payload.append('limit', formData.limit);
    if (formData.image) payload.append('featuredImage', formData.image);

    try {
      // Create the blog.
      const data = await api.addBlog(payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // Assume the created blog data contains its unique ID.
      const newBlogId = data?._id || (data.blog && data.blog._id);
      // If a category is selected, update that category.
      if (selectedCategory && newBlogId) {
        // Find the selected category from the list.
        const categoryToUpdate = categories.find(
          (cat) => (cat._id.$oid ? cat._id.$oid : cat._id) === selectedCategory
        );
        // Prepare an updated blogs array.
        const existingBlogs = categoryToUpdate && categoryToUpdate.blogs ? categoryToUpdate.blogs : [];
        const updatedBlogs = [...existingBlogs, newBlogId];
        // Update the category with the new blogs array.
        await api.updateCategory(selectedCategory, { blogs: updatedBlogs });
      }
      setStatus({ success: 'Blog added successfully!', loading: false, error: null });
      resetForm();
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setStatus({
        error: err.response?.data?.error || 'Failed to add blog. Please try again.',
        loading: false,
        success: null,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-md border border-gray-200">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {status.loading ? 'Processing...' : 'Add a New Blog'}
      </h1>

      {status.error && (
        <div className="mb-6 p-4 text-sm text-red-600 bg-red-100 rounded-lg">
          {status.error}
        </div>
      )}
      {status.success && (
        <div className="mb-6 p-4 text-sm text-green-600 bg-green-100 rounded-lg">
          {status.success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          {categoriesLoading ? (
            <p>Loading categories...</p>
          ) : categoriesError ? (
            <p className="text-red-500">{categoriesError}</p>
          ) : (
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">Select a category</option>
              {categories.map((category) => {
                // Handle possible nested _id structure.
                const categoryId = category._id?.$oid ? category._id.$oid : category._id;
                return (
                  <option key={categoryId} value={categoryId}>
                    {category.name}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm font-medium text-gray-700">Content</label>
          <Editor
            value={formData.content}
            onTextChange={handleContentChange}
            placeholder="Write your blog content here..."
            style={{ height: '400px' }}
            className="border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Display Limit */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="limit" className="text-sm font-medium text-gray-700">
            Display Limit (Optional)
          </label>
          <input
            id="limit"
            name="limit"
            type="date"
            value={formData.limit}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Featured Image */}
        <div className="grid grid-cols-1 gap-4">
          <label htmlFor="image" className="text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={resetForm}
            disabled={status.loading}
            className="py-2 px-6 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status.loading}
            className="py-2 px-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {status.loading ? 'Submitting...' : 'Add Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPage;
