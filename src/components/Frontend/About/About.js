import React, { useEffect, useState } from 'react';
import api from '../../../services/axios'; // Adjust the path as needed

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.getAboutUsPage();
        setAbout(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load About Us content.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">No About Us content found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Main Image & Header */}
      <div className="flex flex-col items-center mb-8">
        {about.mainImage && (
          <img
            src={about.mainImage}
            alt="Main"
            className="w-full max-h-96 object-cover rounded mb-4"
          />
        )}
        <h1 className="text-4xl font-bold mb-2">{about.companyName}</h1>
        <p className="text-lg text-gray-700 text-center">{about.description}</p>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Mission</h2>
            <p className="text-gray-600">{about.mission}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-3xl font-semibold mb-3 text-gray-800">Vision</h2>
            <p className="text-gray-600">{about.vision}</p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Core Values</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            {about.coreValues.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>

        {/* Testimonials */}
        {about.testimonials && about.testimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {testimonial.image && (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {testimonial.name}
                      </h3>
                      <p className="text-yellow-500">Rating: {testimonial.review}/10</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.testimonial}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {about.experiences && about.experiences.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  {exp.image && (
                    <img
                      src={exp.image}
                      alt={exp.projectName}
                      className="w-full h-56 object-cover rounded mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    {exp.projectName}
                  </h3>
                  <p className="text-gray-600">{exp.workExperience}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {about.team && about.team.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {about.team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col items-center"
                >
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.contact}</p>
                  <p className="text-gray-600 text-center mt-2">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestones */}
        {about.milestones && about.milestones.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Milestones</h2>
            <div className="space-y-6">
              {about.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col md:flex-row items-center"
                >
                  {milestone.image && (
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-24 h-24 object-cover rounded mb-4 md:mb-0 md:mr-6"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600 mb-2">{milestone.description}</p>
                    <p className="text-gray-500">
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media */}
        {about.socialMedia && about.socialMedia.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Follow Us</h2>
            <div className="flex flex-wrap items-center space-x-4 justify-start">
              {about.socialMedia.map((social, index) => {
                // Map each platform to a Font Awesome icon class
                const socialIcons = {
                  Facebook: 'fab fa-facebook-f',
                  Twitter: 'fab fa-twitter',
                  LinkedIn: 'fab fa-linkedin-in',
                  Instagram: 'fab fa-instagram',
                  YouTube: 'fab fa-youtube',
                  GitHub: 'fab fa-github',
                  // Add more mappings as needed
                };

                // Default to a generic icon if the platform is not recognized
                const iconClass = socialIcons[social.platform] || 'fas fa-globe';

                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-full transition-colors"
                  >
                    <i className={`${iconClass} text-xl`} />
                    <span className="text-sm font-medium">{social.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AboutPage;
