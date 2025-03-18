import React, { useState, useEffect } from 'react';
import api from '../../../services/axios'; // Adjust the path as needed

const HomePage = () => {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await api.gethomePage();
        setHome(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Home Page content.");
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!home) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No Home Page content found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12">
        {home.hero.backgroundImage && (
          <img
            src={`http://localhost:5000${home.hero.backgroundImage}`}
            alt="Hero Background"
            className="w-full h-96 object-cover rounded"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-bold text-white">{home.hero.heading}</h1>
          <p className="text-xl text-gray-200 mt-4">{home.hero.tagline}</p>
          {home.hero.buttonText && (
            <a
              href={home.hero.buttonLink}
              className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
            >
              {home.hero.buttonText}
            </a>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row items-center mb-12">
        {home.about.image && (
          <img
            src={`http://localhost:5000${home.about.image}`}
            alt="About"
            className="w-full md:w-1/2 rounded shadow-lg mb-4 md:mb-0"
          />
        )}
        <div className="md:pl-12">
          <h2 className="text-4xl font-bold mb-4">{home.about.title}</h2>
          <p className="text-gray-700 mb-4">{home.about.description}</p>
          {home.about.readMoreLink && (
            <a
              href={home.about.readMoreLink}
              className="text-blue-600 hover:underline"
            >
              Read More
            </a>
          )}
        </div>
      </div>

      {/* Services Section */}
      {home.services && home.services.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {home.services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                <div className="mb-4">
                  <i className={`${service.icon} text-4xl text-blue-600`}></i>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Section */}
      {home.portfolio && home.portfolio.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {home.portfolio.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded shadow-lg">
                {item.image && (
                  <img
                    src={`http://localhost:5000${item.image}`}
                    alt={item.alt || item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xl font-semibold">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA Section */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{home.contactCTA.heading}</h2>
          <p className="text-xl text-blue-100 mb-6">{home.contactCTA.subText}</p>
          <a
            href={home.contactCTA.buttonLink}
            className="bg-white text-blue-600 py-2 px-6 rounded hover:bg-gray-100 transition"
          >
            {home.contactCTA.buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
