import React, { useState } from 'react';
import api from '../../services/axios';
import { getToken } from '../../services/authService';

const FileUpload = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle title input changes
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setMessage('');
    setError('');
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
    setError('');
  };

  // Submit the form data
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    // Create FormData and append title and file
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    setLoading(true);

    try {
      // POST the form data to the backend endpoint
      const response = await api.addTest(formData);
      setMessage(response.data || 'File uploaded successfully!');
      setError('');
    } catch (err) {
      console.log('test.js error:', err);
      console.error('Error details:', err);
      setError('Failed to upload file.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            File
          </label>
          <input
            id="file"
            type="file"
            name="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default FileUpload;
