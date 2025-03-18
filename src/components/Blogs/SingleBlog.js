import React, { useEffect, useState } from 'react';
import api from '../../services/axios';
import 'quill/dist/quill.snow.css'; // Ensure Quill styles are included

const SingleBlog = ({ id, onBack }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.getBlog(id);
        setBlog(response.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl text-gray-500">Loading blog...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center text-xl text-gray-500">Blog not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <button
        onClick={onBack}
        className="text-blue-500 mb-4 inline-block hover:underline"
      >
        ← Back to Blog List
      </button>
      <img
        src={blog.featuredImage || 'https://via.placeholder.com/600x400'}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        Uploaded on: {new Date(blog.uploadedOn).toLocaleDateString()}
      </p>
      <p className="text-gray-500 text-sm mb-4">
        Uploaded by: {blog.uploadedBy?.name || 'Unknown'} ({blog.uploadedBy?.position || 'N/A'})
      </p>
      
      {/* Render Quill content */}
      <div
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default SingleBlog;
