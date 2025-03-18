// src/utils/PrivateRoute.js
import React from 'react';
import { getToken } from '../services/authService'; 

const PrivateRoute = ({ children }) => {
  const token = getToken(); 

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800">You need to log in to access this page.</h2>
          <p className="mt-4 text-gray-600">Please log in to continue.</p>
          <a
            href="https://dashboard-gamma-orpin.vercel.app/login"
            className="mt-6 inline-block bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600"
          >
            Login
          </a>
        </div>
      </div>
    ); 
  }

  return children; 
};

export default PrivateRoute;
