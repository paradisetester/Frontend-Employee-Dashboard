// src/components/Frontend/Layout.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header'; // Public header component
import NotFound from '../NotFound';
import BlogsList from './Blogs/BlogsList'; // Import BlogsList component
import AboutPage from './About/About';
import HomePage from './Home/HomePage';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> {/* Public header */}
      <div className="flex-1 p-7">
        <Routes>
          {/* Use the index route so that /frontend renders HomePage */}
          <Route index element={<HomePage />} />
          <Route path="blogs" element={<BlogsList />} />
          <Route path="about" element={<AboutPage />} />
          {/* Additional public routes can be added here */}
          <Route path="*" element={<NotFound />} /> {/* Fallback route */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
