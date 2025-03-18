// src/components/Frontend/Home/HomePageForm.js
import React, { useState, useEffect } from 'react';
import api from '../../../services/axios';

const HomePageForm = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [homeId, setHomeId] = useState(null);

  // Hero section state
  const [heroHeading, setHeroHeading] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');
  const [heroButtonLink, setHeroButtonLink] = useState('');
  const [heroBackground, setHeroBackground] = useState(null);

  // About section state (for Home page)
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [aboutReadMoreLink, setAboutReadMoreLink] = useState('');
  const [aboutImage, setAboutImage] = useState(null);

  // Services array state
  const [services, setServices] = useState([]);

  // Portfolio items state
  const [portfolio, setPortfolio] = useState([]);

  // Contact CTA state
  const [contactHeading, setContactHeading] = useState('');
  const [contactSubText, setContactSubText] = useState('');
  const [contactButtonText, setContactButtonText] = useState('');
  const [contactButtonLink, setContactButtonLink] = useState('');

  // Fetch Home Page data on mount
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await api.gethomePage();
        if (data) {
          setIsEditMode(true);
          setHomeId(data._id);
          // Populate Hero fields
          setHeroHeading(data.hero.heading);
          setHeroTagline(data.hero.tagline);
          setHeroButtonText(data.hero.buttonText);
          setHeroButtonLink(data.hero.buttonLink);
          // Populate About fields
          setAboutTitle(data.about.title);
          setAboutDescription(data.about.description);
          setAboutReadMoreLink(data.about.readMoreLink);
          // Populate Services and Portfolio arrays
          setServices(data.services || []);
          setPortfolio(data.portfolio || []);
          // Populate Contact CTA fields
          setContactHeading(data.contactCTA.heading);
          setContactSubText(data.contactCTA.subText);
          setContactButtonText(data.contactCTA.buttonText);
          setContactButtonLink(data.contactCTA.buttonLink);
        }
      } catch (error) {
        console.error("Error fetching Home Page data:", error);
      }
    };

    fetchHome();
  }, []);

  // Handlers for Services array
  const handleAddService = () => {
    setServices([...services, { icon: '', title: '', description: '' }]);
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  // Handlers for Portfolio items array
  const handleAddPortfolio = () => {
    setPortfolio([...portfolio, { title: '', alt: '', image: null }]);
  };

  const handlePortfolioChange = (index, field, value) => {
    const newPortfolio = [...portfolio];
    newPortfolio[index][field] = value;
    setPortfolio(newPortfolio);
  };

  // Submit handler for Home Page form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append Hero fields
    formData.append('heroHeading', heroHeading);
    formData.append('heroTagline', heroTagline);
    formData.append('heroButtonText', heroButtonText);
    formData.append('heroButtonLink', heroButtonLink);
    if (heroBackground) {
      formData.append('heroBackground', heroBackground);
    }

    // Append About fields
    formData.append('aboutTitle', aboutTitle);
    formData.append('aboutDescription', aboutDescription);
    formData.append('aboutReadMoreLink', aboutReadMoreLink);
    if (aboutImage) {
      formData.append('aboutImage', aboutImage);
    }

    // Append Services as JSON
    formData.append('services', JSON.stringify(services));

    // Append Portfolio items as JSON (images handled separately)
    formData.append('portfolio', JSON.stringify(
      portfolio.map(item => ({
        title: item.title,
        alt: item.alt
      }))
    ));
    portfolio.forEach((item) => {
      if (item.image && item.image instanceof File) {
        formData.append('portfolioImages', item.image);
      }
    });

    // Append Contact CTA fields
    formData.append('contactHeading', contactHeading);
    formData.append('contactSubText', contactSubText);
    formData.append('contactButtonText', contactButtonText);
    formData.append('contactButtonLink', contactButtonLink);

    try {
      let response;
      if (isEditMode && homeId) {
        response = await api.updateHomePage(homeId, formData);
      } else {
        response = await api.newhomePage(formData);
      }
      console.log('Response:', response);
      // Optionally show success message or redirect here
    } catch (err) {
      console.error("Error submitting Home Page form:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Home Page' : 'Add Home Page'}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Hero Section */}
        <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Heading</label>
          <input type="text" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Hero Heading" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tagline</label>
          <input type="text" value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Hero Tagline" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Button Text</label>
            <input type="text" value={heroButtonText} onChange={(e) => setHeroButtonText(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Button Text" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Button Link</label>
            <input type="text" value={heroButtonLink} onChange={(e) => setHeroButtonLink(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Button Link" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Hero Background Image</label>
          <input type="file" onChange={(e) => setHeroBackground(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded" />
        </div>

        {/* About Section */}
        <h2 className="text-2xl font-bold mb-4">About Section</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input type="text" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="About Title" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="About Description" rows="4"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Read More Link</label>
          <input type="text" value={aboutReadMoreLink} onChange={(e) => setAboutReadMoreLink(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Read More Link" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">About Image</label>
          <input type="file" onChange={(e) => setAboutImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded" />
        </div>

        {/* Services Section */}
        <h2 className="text-2xl font-bold mb-4">Services</h2>
        {services.map((service, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Icon</label>
              <input type="text" value={service.icon} onChange={(e) => handleServiceChange(index, 'icon', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Icon (e.g. fas fa-code)" />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Title</label>
              <input type="text" value={service.title} onChange={(e) => handleServiceChange(index, 'title', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Service Title" />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
              <textarea value={service.description} onChange={(e) => handleServiceChange(index, 'description', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Service Description" rows="2"></textarea>
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddService} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6">
          Add Service
        </button>

        {/* Portfolio Section */}
        <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
        {portfolio.map((item, index) => (
          <div key={index} className="border p-4 rounded mb-4">
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Title</label>
              <input type="text" value={item.title} onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Portfolio Title" />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Alt Text</label>
              <input type="text" value={item.alt} onChange={(e) => handlePortfolioChange(index, 'alt', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Alt Text" />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-1">Image</label>
              <input type="file" onChange={(e) => handlePortfolioChange(index, 'image', e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded" />
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddPortfolio} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-6">
          Add Portfolio Item
        </button>

        {/* Contact CTA Section */}
        <h2 className="text-2xl font-bold mb-4">Contact CTA</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Heading</label>
          <input type="text" value={contactHeading} onChange={(e) => setContactHeading(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Contact Heading" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Sub Text</label>
          <input type="text" value={contactSubText} onChange={(e) => setContactSubText(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Contact Sub Text" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Button Text</label>
            <input type="text" value={contactButtonText} onChange={(e) => setContactButtonText(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Button Text" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Button Link</label>
            <input type="text" value={contactButtonLink} onChange={(e) => setContactButtonLink(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3" placeholder="Button Link" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Save Home Page
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePageForm;
