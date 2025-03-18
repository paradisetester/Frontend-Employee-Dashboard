import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRole, logout } from '../services/authService';

const Menu = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedRole = getRole(); // Fetch the role from localStorage
    setRole(fetchedRole); // Set the role in the state
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page after logout
  };

  if (role === null) {
    return <div>Loading...</div>;  // Show a loading message while role is being fetched
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 fixed left-0 top-0 h-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Dashboard Menu</h2>
        <ul className="space-y-4">
          {/* Regular menu items */}
          <li>
            <Link to="/blogs" className="block p-2 hover:bg-gray-700 rounded">
              View Blogs
            </Link>
          </li>
          <li>
            <Link to="/apply-leave" className="block p-2 hover:bg-gray-700 rounded">
              Apply for Leave
            </Link>
          </li>
          <li>
            <Link to="/update-profile" className="block p-2 hover:bg-gray-700 rounded">
              Update Profile
            </Link>
          </li>

          {/* HR and Admin only links */}
          {role === 'HR' || role === 'admin' ? (
            <>
              <li>
                <Link to="/add-employee" className="block p-2 hover:bg-gray-700 rounded">
                  Add Employee
                </Link>
              </li>
              <li>
                <Link to="/employee-list" className="block p-2 hover:bg-gray-700 rounded">
                  View Employee List
                </Link>
              </li>
              <li>
                <Link to="/leave-list" className="block p-2 hover:bg-gray-700 rounded">
                  View Leave Requests
                </Link>
              </li>
              <li>
                <Link to="/add-blog" className="block p-2 hover:bg-gray-700 rounded">
                  Add Blog
                </Link>
              </li>
            </>
          ) : null}
        </ul>
        <button
          onClick={handleLogout}
          className="mt-8 w-full p-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-auto">
        {/* This is where the page content will be rendered */}
      </div>
    </div>
  );
};

export default Menu;
