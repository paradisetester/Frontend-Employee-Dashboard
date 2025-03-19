import React, { useEffect, useState } from 'react';
import api from '../../../services/axios';
import Comments from '../../Blogs/Comments/Comments';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeft, FaComments, FaSearch } from 'react-icons/fa';

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]); // backup of all blogs
  const [categories, setCategories] = useState([]); // list of all categories
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all blogs and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all blogs
        const blogData = await api.getBlogs();
        const blogsList = Array.isArray(blogData) ? blogData : blogData.blogs || [];
        setBlogs(blogsList);
        setAllBlogs(blogsList);

        // Fetch all categories
        const categoryData = await api.getCategories();
        const categoriesList = Array.isArray(categoryData) ? categoryData : categoryData.categories || [];
        setCategories(categoriesList);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category filter change
  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);
    setLoading(true);
    try {
      if (catId === 'all') {
        // Restore all blogs if "All Categories" is selected
        setBlogs(allBlogs);
      } else {
        // Fetch blogs specific to the selected category.
        const data = await api.getCategoryBlogs(catId);
        // Assuming the API returns an object with a "blogs" field.
        setBlogs(data.blogs || []);
      }
      // Reset to first page whenever the filter changes.
      setCurrentPage(1);
    } catch (err) {
      setError('Error fetching category blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle "Read More" action for a blog
  const handleReadMore = async (id) => {
    setLoading(true);
    try {
      const data = await api.getBlog(id);
      setSelectedBlog(data);
      setShowComments(false);
    } catch (err) {
      setError('Error fetching blog details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
    setShowComments(false);
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  // Apply search filtering on top of the current blogs list
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-xl text-red-500 py-10 bg-gray-100 min-h-screen flex flex-col justify-center">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 inline-flex items-center justify-center"
        >
          Retry
        </button>
      </div>
    );
  }

  // If a blog is selected, display its details
  if (selectedBlog) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
        <button
          onClick={handleBackToList}
          className="text-blue-600 mb-4 hover:underline font-medium inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Blog List
        </button>
        <div className="relative">
          <img
            src={selectedBlog.featuredImage}
            alt={selectedBlog.title}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg"></div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{selectedBlog.title}</h1>
        <p className="text-gray-600 text-lg mb-2">
          Uploaded on: {new Date(selectedBlog.uploadedOn).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-lg mb-8">
          Uploaded by: {selectedBlog.uploadedBy?.name || 'Unknown'}
        </p>
        <div
          className="text-gray-700 leading-relaxed text-lg prose max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
        />

        {/* Toggle Comments Section */}
        <div className="mt-8">
          <button
            onClick={() => setShowComments(prev => !prev)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            <FaComments className="mr-2" /> {showComments ? 'Hide Comments' : 'View Comments'}
          </button>
          {showComments && (
            <div className="mt-4">
              <Comments blogId={selectedBlog._id} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">All Blogs</h1>
      {/* Category Filter & Search Input */}
      <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="relative w-full max-w-md">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog).map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-60 object-cover rounded-lg mb-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{blog.title}</h2>
            <div
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: blog.content.substring(0, 100) + '...',
              }}
            />
            <button
              onClick={() => handleReadMore(blog._id)}
              className="text-blue-600 hover:underline font-medium inline-flex items-center"
            >
              Read more
            </button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from(
          { length: Math.ceil(filteredBlogs.length / blogsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              } hover:bg-blue-600 hover:text-white transition duration-300`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default BlogsList;
