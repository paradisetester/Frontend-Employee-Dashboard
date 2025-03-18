// src/utils/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicRoute = () => {
  return (
    <div>
      <header>
        <h1>Welcome to Our Public Site</h1>
        {/* You can add navigation links here */}
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2025 My Application</p>
      </footer>
    </div>
  );
};

export default PublicRoute;
