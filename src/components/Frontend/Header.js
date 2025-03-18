// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/frontend">Public Portal</Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/frontend/blogs" className="text-gray-600 hover:text-gray-800">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/frontend/about" className="text-gray-600 hover:text-gray-800">
                About
              </Link>
            </li>
            <li>
              <Link to="/frontend/contact" className="text-gray-600 hover:text-gray-800">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
