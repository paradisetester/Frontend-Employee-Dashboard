// src/components/Frontend/Footer.js
import React, { useState, useEffect } from 'react';
import api from '../../services/axios';

const Footer = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await api.getFooter(); // Ensure your API has a getFooter endpoint
        setFooter(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Footer content.");
      } finally {
        setLoading(false);
      }
    };

    fetchFooter();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-lg">Loading Footer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>No Footer content found.</p>
      </div>
    );
  }

  return (
    <footer className="bg-gray-800 text-gray-300 pt-8">
      <div className="container mx-auto px-4">
        {/* Top row with 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Logo & Description */}
          <div>
            <div className="mb-4">
              {footer.mainImage && (
                <img
                  src={footer.mainImage}
                  alt="Company Logo"
                  className="h-16"
                />
              )}
            </div>
            <p className="text-sm">
              {footer.text}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footer.quickLinks && footer.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footer.services && footer.services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.url}
                    className="hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact us</h3>
            {footer.contactUs && (
              <ul className="space-y-2 text-sm">
                <li>
                  <i className="fa fa-map-marker mr-2" aria-hidden="true"></i>
                  {footer.contactUs.address}
                </li>
                <li>
                  <i className="fa fa-mobile mr-2" aria-hidden="true"></i>
                  <a href={`tel:${footer.contactUs.phone}`} className="hover:underline">
                    {footer.contactUs.phone}
                  </a>
                </li>
                {footer.contactUs.emails && footer.contactUs.emails.map((email, index) => (
                  <li key={index}>
                    <i className="fa fa-envelope mr-2" aria-hidden="true"></i>
                    <a href={`mailto:${email}`} className="hover:underline">
                      {email}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-700" />

        {/* Social Icons and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://www.facebook.com/ParadiseTechSoftSolution/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="https://www.linkedin.com/company/3302119/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fa fa-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://github.com/paradisetechsoftsolutions?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fa fa-github-alt" aria-hidden="true"></i>
            </a>
            <a href="https://www.youtube.com/channel/UCtigT7sVQVbai1NLO0fGGug/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fa fa-youtube-play" aria-hidden="true"></i>
            </a>
            <a href="https://github.com/puneet-kaushal" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
              <i className="fa fa-github" aria-hidden="true"></i>
            </a>
          </div>
          <p className="text-sm text-gray-500">
            All Content TM &amp; © {new Date().getFullYear()} Paradise Techsoft Solutions Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
