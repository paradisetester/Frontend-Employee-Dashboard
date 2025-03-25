import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/authService';
import api from '../../services/axios';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    salary: '',
    position: '',
    department: '',
    // Personal details
    personalLocation: '',
    personalDob: '',
    personalGender: 'male',
    personalMaritalStatus: 'single',
    personalNationality: '',
    // Address
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZipCode: '',
    addressCountry: '',
    // Contact
    contactPrimary: '',
    contactSecondary: '',
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    // Identification
    identificationNationalId: '',
    identificationPassportNumber: '',
    // Social Profiles
    socialLinkedIn: '',
    socialTwitter: '',
    // Current profile picture URL
    profilepicture: '',
  });

  // For updating profile picture file (if a new file is selected)
  const [profilePicFile, setProfilePicFile] = useState(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await api.getProfile();
        // Assuming response is the employee object.
        setFormData({
          name: response.name || '',
          email: response.email || '',
          age: response.age || '',
          salary: response.salary || '',
          position: response.position || '',
          department: response.department || '',
          personalLocation: response.personaldetails?.location || '',
          personalDob: response.personaldetails?.dob ? response.personaldetails.dob.substring(0, 10) : '',
          personalGender: response.personaldetails?.gender || 'male',
          personalMaritalStatus: response.personaldetails?.maritalStatus || 'single',
          personalNationality: response.personaldetails?.nationality || '',
          addressStreet: response.address?.street || '',
          addressCity: response.address?.city || '',
          addressState: response.address?.state || '',
          addressZipCode: response.address?.zipCode || '',
          addressCountry: response.address?.country || '',
          contactPrimary: response.contact?.primaryPhone || '',
          contactSecondary: response.contact?.secondaryPhone || '',
          emergencyName: response.emergencyContact?.name || '',
          emergencyPhone: response.emergencyContact?.phone || '',
          emergencyRelationship: response.emergencyContact?.relationship || '',
          identificationNationalId: response.identification?.nationalId || '',
          identificationPassportNumber: response.identification?.passportNumber || '',
          socialLinkedIn: response.socialProfiles?.linkedIn || '',
          socialTwitter: response.socialProfiles?.twitter || '',
          profilepicture: response.profilepicture || '',
        });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    const token = getToken();
    if (!token) {
      setError('You must be logged in to update your profile.');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData to handle file upload and nested objects.
      const data = new FormData();

      // Append basic fields
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('age', formData.age);
      data.append('salary', formData.salary);
      data.append('position', formData.position);
      data.append('department', formData.department);

      // Build nested objects and append as JSON strings
      const personaldetails = {
        location: formData.personalLocation,
        dob: formData.personalDob,
        gender: formData.personalGender,
        maritalStatus: formData.personalMaritalStatus,
        nationality: formData.personalNationality,
      };
      data.append('personaldetails', JSON.stringify(personaldetails));

      const address = {
        street: formData.addressStreet,
        city: formData.addressCity,
        state: formData.addressState,
        zipCode: formData.addressZipCode,
        country: formData.addressCountry,
      };
      data.append('address', JSON.stringify(address));

      const contact = {
        primaryPhone: formData.contactPrimary,
        secondaryPhone: formData.contactSecondary,
      };
      data.append('contact', JSON.stringify(contact));

      const emergencyContact = {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRelationship,
      };
      data.append('emergencyContact', JSON.stringify(emergencyContact));

      const identification = {
        nationalId: formData.identificationNationalId,
        passportNumber: formData.identificationPassportNumber,
      };
      data.append('identification', JSON.stringify(identification));

      const socialProfiles = {
        linkedIn: formData.socialLinkedIn,
        twitter: formData.socialTwitter,
      };
      data.append('socialProfiles', JSON.stringify(socialProfiles));

      // Append new profile picture if selected; otherwise, append the current picture URL
      if (profilePicFile) {
        data.append('profilepicture', profilePicFile);
      } else if (formData.profilepicture) {
        data.append('profilepicture', formData.profilepicture);
      }

      // Decode token to get user ID (assuming your token payload has an 'id' field)
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      await api.updateEmployee(decodedToken.id, data);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Server error, please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Update Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Keep your information up to date
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
              {[
                { label: 'Full Name', type: 'text', name: 'name' },
                { label: 'Email Address', type: 'email', name: 'email' },
                { label: 'Age', type: 'number', name: 'age' },
                { label: 'Salary ($)', type: 'number', name: 'salary' },
                { label: 'Position', type: 'text', name: 'position' },
                { label: 'Department', type: 'text', name: 'department' },
              ].map(({ label, type, name }) => (
                <div key={name}>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Personal Details</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="personalLocation"
                    value={formData.personalLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="personalDob"
                    value={formData.personalDob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="personalGender"
                    value={formData.personalGender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    name="personalMaritalStatus"
                    value={formData.personalMaritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <input
                    type="text"
                    name="personalNationality"
                    value={formData.personalNationality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter nationality"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Address</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                  <input
                    type="text"
                    name="addressStreet"
                    value={formData.addressStreet}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="addressCity"
                    value={formData.addressCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="addressState"
                    value={formData.addressState}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="addressZipCode"
                    value={formData.addressZipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter zip code"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="addressCountry"
                    value={formData.addressCountry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Contact Information</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
                  <input
                    type="text"
                    name="contactPrimary"
                    value={formData.contactPrimary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter primary phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                  <input
                    type="text"
                    name="contactSecondary"
                    value={formData.contactSecondary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter secondary phone"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Emergency Contact</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter emergency contact phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter relationship"
                  />
                </div>
              </div>
            </div>

            {/* Identification */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Identification</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
                  <input
                    type="text"
                    name="identificationNationalId"
                    value={formData.identificationNationalId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter national ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    type="text"
                    name="identificationPassportNumber"
                    value={formData.identificationPassportNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter passport number"
                  />
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Social Profiles</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="text"
                    name="socialLinkedIn"
                    value={formData.socialLinkedIn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter LinkedIn URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="text"
                    name="socialTwitter"
                    value={formData.socialTwitter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Enter Twitter URL"
                  />
                </div>
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-700">Update Profile Picture</h3>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            {/* Display current profile picture */}
            <div>
              <h3 className="text-xl font-medium text-gray-700">Current Profile Picture</h3>
              {formData.profilepicture ? (
                <img
                  src={formData.profilepicture}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full"
                />
              ) : (
                <p>No profile picture available.</p>
              )}
            </div>

            {/* Status Messages */}
            <div className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-600">{successMessage}</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 border border-transparent rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
