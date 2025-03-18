// src/components/Frontend/Footer/FooterForm.js
import React, { useState, useEffect } from 'react';
import api from '../../../services/axios';

const FooterForm = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [footerId, setFooterId] = useState(null);

  // State for mainImage file
  const [mainImage, setMainImage] = useState(null);
  // Company description
  const [text, setText] = useState('');
  // Quick links array (e.g. Home, About, etc.)
  const [quickLinks, setQuickLinks] = useState([]);
  // Services array (e.g. Web Designing, Web Development, etc.)
  const [services, setServices] = useState([]);
  // Contact information: address, phone, and emails array
  const [contactUs, setContactUs] = useState({ address: '', phone: '', emails: [] });

  // Fetch Footer data on mount
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const data = await api.getFooter();
        if (data) {
          setIsEditMode(true);
          setFooterId(data._id);
          setText(data.text);
          // Note: For mainImage, you may show a preview using data.mainImage URL if needed.
          setQuickLinks(data.quickLinks || []);
          setServices(data.services || []);
          setContactUs(data.contactUs || { address: '', phone: '', emails: [] });
        }
      } catch (error) {
        console.error("Error fetching Footer data:", error);
      }
    };

    fetchFooter();
  }, []);

  // Handler for mainImage file input
  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  // Handlers for Quick Links
  const handleAddQuickLink = () => {
    setQuickLinks([...quickLinks, { label: '', url: '' }]);
  };

  const handleQuickLinkChange = (index, field, value) => {
    const newQuickLinks = [...quickLinks];
    newQuickLinks[index][field] = value;
    setQuickLinks(newQuickLinks);
  };

  // Handlers for Services
  const handleAddService = () => {
    setServices([...services, { label: '', url: '' }]);
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  // Handlers for contactUs fields
  const handleContactChange = (field, value) => {
    setContactUs({ ...contactUs, [field]: value });
  };

  const handleAddEmail = () => {
    setContactUs({ ...contactUs, emails: [...contactUs.emails, ''] });
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...contactUs.emails];
    newEmails[index] = value;
    setContactUs({ ...contactUs, emails: newEmails });
  };

  // Submit handler for Footer form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append basic fields
    formData.append('text', text);
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }
    // Append nested fields as JSON strings
    formData.append('quickLinks', JSON.stringify(quickLinks));
    formData.append('services', JSON.stringify(services));
    formData.append('contactUs', JSON.stringify(contactUs));

    try {
      let response;
      if (isEditMode && footerId) {
        response = await api.updateFooter(footerId, formData);
      } else {
        response = await api.newFooter(formData);
      }
      console.log("Response:", response);
      // Optionally show a success message or redirect here
    } catch (err) {
      console.error("Error submitting Footer form:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Footer' : 'Add Footer'}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Main Image */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Footer Main Image
          </label>
          <input
            type="file"
            onChange={handleMainImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded"
          />
        </div>

        {/* Footer Text */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Footer Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
            placeholder="Footer Text"
            rows="3"
          ></textarea>
        </div>

        {/* Quick Links */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          {quickLinks.map((link, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleQuickLinkChange(index, 'label', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  placeholder="Link Label"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  placeholder="Link URL"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuickLink}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Quick Link
          </button>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          {services.map((service, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={service.label}
                  onChange={(e) => handleServiceChange(index, 'label', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  placeholder="Service Label"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={service.url}
                  onChange={(e) => handleServiceChange(index, 'url', e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  placeholder="Service URL"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddService}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Service
          </button>
        </div>

        {/* Contact Us */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              value={contactUs.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
              placeholder="Address"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="text"
              value={contactUs.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3"
              placeholder="Phone"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Emails</h3>
            {contactUs.emails.map((email, index) => (
              <div key={index} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  placeholder="Email"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEmail}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Add Email
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Save Footer
          </button>
        </div>
      </form>
    </div>
  );
};

export default FooterForm;
