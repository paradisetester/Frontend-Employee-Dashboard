import React, { useState, useEffect } from 'react';
import api from '../../../services/axios';

const AboutUsForm = () => {
  // Flag for edit mode and existing About page ID
  const [isEditMode, setIsEditMode] = useState(false);
  const [aboutId, setAboutId] = useState(null);

  // Basic fields
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [coreValues, setCoreValues] = useState('');
  const [mainImage, setMainImage] = useState(null);

  // Arrays for nested items
  const [testimonials, setTestimonials] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [team, setTeam] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);

  // On mount, check if an About Us page exists
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.getAboutUsPage();
        if (data) {
          // If a page exists, switch to edit mode and populate fields
          setIsEditMode(true);
          setAboutId(data._id);
          setCompanyName(data.companyName);
          setDescription(data.description);
          setMission(data.mission || '');
          setVision(data.vision || '');
          // Convert the array into a comma separated string for editing
          setCoreValues(data.coreValues ? data.coreValues.join(', ') : '');
          // For images: mainImage is a URL. (For file inputs, users may choose to update it.)
          // Nested arrays:
          setTestimonials(data.testimonials || []);
          setExperiences(data.experiences || []);
          setTeam(data.team || []);
          setMilestones(data.milestones || []);
          setSocialMedia(data.socialMedia || []);
        }
      } catch (error) {
        console.error("Error fetching About Us page:", error);
      }
    };

    fetchAbout();
  }, []);

  // Handlers for testimonials
  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      { name: '', testimonial: '', review: '', image: null },
    ]);
  };

  const handleTestimonialChange = (index, field, value) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index][field] = value;
    setTestimonials(newTestimonials);
  };

  // Handlers for experiences
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { projectName: '', workExperience: '', image: null },
    ]);
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  // Handlers for team members
  const handleAddTeamMember = () => {
    setTeam([
      ...team,
      { name: '', role: '', bio: '', image: null, contact: '' },
    ]);
  };

  const handleTeamChange = (index, field, value) => {
    const newTeam = [...team];
    newTeam[index][field] = value;
    setTeam(newTeam);
  };

  // Handlers for milestones
  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', description: '', date: '', image: null },
    ]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  // Handlers for social media links
  const handleAddSocialMedia = () => {
    setSocialMedia([
      ...socialMedia,
      { platform: '', url: '' },
    ]);
  };

  const handleSocialMediaChange = (index, field, value) => {
    const newSocialMedia = [...socialMedia];
    newSocialMedia[index][field] = value;
    setSocialMedia(newSocialMedia);
  };

  // Submit handler to either create or update the page
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append basic text fields
    formData.append('companyName', companyName);
    formData.append('description', description);
    formData.append('mission', mission);
    formData.append('vision', vision);
    formData.append(
      'coreValues',
      JSON.stringify(coreValues.split(',').map((item) => item.trim()))
    );

    // Append main image if a new file is selected
    if (mainImage) {
      formData.append('mainImage', mainImage);
    }

    // Append nested arrays as JSON strings
    formData.append(
      'testimonials',
      JSON.stringify(
        testimonials.map((t) => ({
          name: t.name,
          testimonial: t.testimonial,
          review: t.review,
          // Image will be handled separately
        }))
      )
    );
    formData.append(
      'experiences',
      JSON.stringify(
        experiences.map((exp) => ({
          projectName: exp.projectName,
          workExperience: exp.workExperience,
        }))
      )
    );
    formData.append(
      'team',
      JSON.stringify(
        team.map((member) => ({
          name: member.name,
          role: member.role,
          bio: member.bio,
          contact: member.contact,
        }))
      )
    );
    formData.append(
      'milestones',
      JSON.stringify(
        milestones.map((m) => ({
          title: m.title,
          description: m.description,
          date: m.date,
        }))
      )
    );
    formData.append(
      'socialMedia',
      JSON.stringify(
        socialMedia.map((s) => ({
          platform: s.platform,
          url: s.url,
        }))
      )
    );

    // Append nested image files separately if a new file is selected
    testimonials.forEach((t) => {
      if (t.image && t.image instanceof File) {
        formData.append('testimonialImages', t.image);
      }
    });
    experiences.forEach((exp) => {
      if (exp.image && exp.image instanceof File) {
        formData.append('experienceImages', exp.image);
      }
    });
    team.forEach((member) => {
      if (member.image && member.image instanceof File) {
        formData.append('teamImages', member.image);
      }
    });
    milestones.forEach((m) => {
      if (m.image && m.image instanceof File) {
        formData.append('milestoneImages', m.image);
      }
    });

    try {
      let response;
      if (isEditMode && aboutId) {
        // Update existing About page
        response = await api.updateAboutUsPage(aboutId, formData);
      } else {
        // Create a new About page
        response = await api.newaboutusPage(formData);
      }
      console.log('Response:', response);
      // Optionally show a success message or redirect
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit About Us Page' : 'Add About Us Page'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Company Details */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Company Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Description"
            rows="4"
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mission
            </label>
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Mission"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Vision
            </label>
            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Vision"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Core Values (comma separated)
          </label>
          <input
            type="text"
            value={coreValues}
            onChange={(e) => setCoreValues(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            placeholder="e.g. Innovation, Integrity, Excellence"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Main Image
          </label>
          <input
            type="file"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
              file:rounded file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Testimonials Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) =>
                    handleTestimonialChange(index, 'name', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Name"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Testimonial
                </label>
                <textarea
                  value={testimonial.testimonial}
                  onChange={(e) =>
                    handleTestimonialChange(index, 'testimonial', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Testimonial"
                  rows="2"
                ></textarea>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Review (1-10)
                </label>
                <input
                  type="number"
                  value={testimonial.review}
                  onChange={(e) =>
                    handleTestimonialChange(index, 'review', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  min="1"
                  max="10"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleTestimonialChange(index, 'image', e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTestimonial}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Testimonial
          </button>
        </div>

        {/* Experiences Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Experiences</h2>
          {experiences.map((experience, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={experience.projectName}
                  onChange={(e) =>
                    handleExperienceChange(index, 'projectName', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Project Name"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Work Experience
                </label>
                <textarea
                  value={experience.workExperience}
                  onChange={(e) =>
                    handleExperienceChange(index, 'workExperience', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Work Experience"
                  rows="2"
                ></textarea>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleExperienceChange(index, 'image', e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExperience}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Experience
          </button>
        </div>

        {/* Team Members Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Team Members</h2>
          {team.map((member, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    handleTeamChange(index, 'name', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Name"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) =>
                    handleTeamChange(index, 'role', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Role"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Bio
                </label>
                <textarea
                  value={member.bio}
                  onChange={(e) =>
                    handleTeamChange(index, 'bio', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Bio"
                  rows="2"
                ></textarea>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Contact
                </label>
                <input
                  type="text"
                  value={member.contact}
                  onChange={(e) =>
                    handleTeamChange(index, 'contact', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Contact"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleTeamChange(index, 'image', e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTeamMember}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Team Member
          </button>
        </div>

        {/* Milestones Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Milestones</h2>
          {milestones.map((milestone, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) =>
                    handleMilestoneChange(index, 'title', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Title"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Description
                </label>
                <textarea
                  value={milestone.description}
                  onChange={(e) =>
                    handleMilestoneChange(index, 'description', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Description"
                  rows="2"
                ></textarea>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={milestone.date}
                  onChange={(e) =>
                    handleMilestoneChange(index, 'date', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    handleMilestoneChange(index, 'image', e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMilestone}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Milestone
          </button>
        </div>

        {/* Social Media Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Social Media</h2>
          {socialMedia.map((social, index) => (
            <div key={index} className="border p-4 rounded mb-4">
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  Platform
                </label>
                <input
                  type="text"
                  value={social.platform}
                  onChange={(e) =>
                    handleSocialMediaChange(index, 'platform', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="Platform"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  URL
                </label>
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) =>
                    handleSocialMediaChange(index, 'url', e.target.value)
                  }
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="URL"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSocialMedia}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Social Media
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Save About Us Page
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutUsForm;
