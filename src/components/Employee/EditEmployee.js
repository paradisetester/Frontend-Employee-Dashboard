import React, { useState, useEffect } from 'react';
import api from '../../services/axios';

const EditEmployee = ({ employee, onClose, onSave }) => {
  // Basic fields (flat)
  const [basicData, setBasicData] = useState({
    name: employee.name || '',
    email: employee.email || '',
    age: employee.age || '',
    salary: employee.salary || '',
    position: employee.position || '',
    department: employee.department || '',
    role: employee.role || 'employee',
  });

  // Nested fields: personal details (we use the first element)
  const pd = employee.personaldetails && employee.personaldetails[0] ? employee.personaldetails[0] : {};
  const [personalLocation, setPersonalLocation] = useState(pd.location || '');
  const [dob, setDob] = useState(pd.dob ? pd.dob.substring(0, 10) : ''); // format for input[type=date]
  const [gender, setGender] = useState(pd.gender || 'male');
  const [maritalStatus, setMaritalStatus] = useState(pd.maritalStatus || 'single');
  const [nationality, setNationality] = useState(pd.nationality || '');

  // Address fields
  const addr = employee.address || {};
  const [street, setStreet] = useState(addr.street || '');
  const [city, setCity] = useState(addr.city || '');
  const [stateVal, setStateVal] = useState(addr.state || '');
  const [zipCode, setZipCode] = useState(addr.zipCode || '');
  const [country, setCountry] = useState(addr.country || '');

  // Contact fields
  const contact = employee.contact || {};
  const [primaryPhone, setPrimaryPhone] = useState(contact.primaryPhone || '');
  const [secondaryPhone, setSecondaryPhone] = useState(contact.secondaryPhone || '');

  // Emergency Contact fields
  const emContact = employee.emergencyContact || {};
  const [emergencyName, setEmergencyName] = useState(emContact.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(emContact.phone || '');
  const [emergencyRelationship, setEmergencyRelationship] = useState(emContact.relationship || '');

  // Identification
  const ident = employee.identification || {};
  const [nationalId, setNationalId] = useState(ident.nationalId || '');
  const [passportNumber, setPassportNumber] = useState(ident.passportNumber || '');

  // Social Profiles
  const social = employee.socialProfiles || {};
  const [linkedIn, setLinkedIn] = useState(social.linkedIn || '');
  const [twitter, setTwitter] = useState(social.twitter || '');

  // Profile picture file (if updating)
  const [profilePicFile, setProfilePicFile] = useState(null);

  // Local state for saving & errors
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Handler for basic fields
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for file change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrors({});

    // Validate required basic fields
    const validationErrors = {};
    if (!basicData.name) validationErrors.name = 'Name is required.';
    if (!basicData.email || !/\S+@\S+\.\S+/.test(basicData.email))
      validationErrors.email = 'Valid email is required.';
    if (!basicData.age || basicData.age < 18)
      validationErrors.age = 'Age must be 18 or older.';
    if (basicData.salary <= 0)
      validationErrors.salary = 'Salary must be a positive number.';
    if (!basicData.position) validationErrors.position = 'Position is required.';
    if (!basicData.department)
      validationErrors.department = 'Department is required.';

    // Validate nested required fields (example: address and personal details)
    if (!personalLocation) validationErrors.personalLocation = 'Location is required.';
    if (!dob) validationErrors.dob = 'Date of Birth is required.';
    if (!street) validationErrors.street = 'Street is required.';
    if (!city) validationErrors.city = 'City is required.';
    if (!stateVal) validationErrors.stateVal = 'State is required.';
    if (!zipCode) validationErrors.zipCode = 'Zip Code is required.';
    if (!country) validationErrors.country = 'Country is required.';
    if (!primaryPhone) validationErrors.primaryPhone = 'Primary phone is required.';
    if (!emergencyName) validationErrors.emergencyName = 'Emergency contact name is required.';
    if (!emergencyPhone) validationErrors.emergencyPhone = 'Emergency contact phone is required.';
    if (!emergencyRelationship) validationErrors.emergencyRelationship = 'Emergency contact relationship is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSaving(false);
      return;
    }

    try {
      // Build FormData to support file upload and nested JSON fields
      const formData = new FormData();
      // Append basic fields
      Object.entries(basicData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append nested objects as JSON strings
      const personaldetails = [{
        location: personalLocation,
        dob,
        gender,
        maritalStatus,
        nationality,
      }];
      formData.append('personaldetails', JSON.stringify(personaldetails));

      const address = { street, city, state: stateVal, zipCode, country };
      formData.append('address', JSON.stringify(address));

      const contact = { primaryPhone, secondaryPhone };
      formData.append('contact', JSON.stringify(contact));

      const emergencyContact = { name: emergencyName, phone: emergencyPhone, relationship: emergencyRelationship };
      formData.append('emergencyContact', JSON.stringify(emergencyContact));

      const identification = { nationalId, passportNumber };
      formData.append('identification', JSON.stringify(identification));

      const socialProfiles = { linkedIn, twitter };
      formData.append('socialProfiles', JSON.stringify(socialProfiles));

      // Append file if updated
      if (profilePicFile) {
        formData.append('profilepicture', profilePicFile);
      }
      // Call the API update function with the employee id and FormData payload
      const updatedEmployee = await api.updateEmployee(employee._id, formData);
      onSave(updatedEmployee);
      alert('Employee updated successfully!');
      console.log(updatedEmployee, 'FormData');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Employee</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={basicData.name}
                  onChange={handleBasicChange}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              {/* Email */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={basicData.email}
                  onChange={handleBasicChange}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
              {/* Age */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={basicData.age}
                  onChange={handleBasicChange}
                  min="18"
                  className={`w-full p-3 mt-1 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
              </div>
              {/* Salary */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={basicData.salary}
                  onChange={handleBasicChange}
                  min="0"
                  className={`w-full p-3 mt-1 border rounded-md ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary}</p>}
              </div>
              {/* Position */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  name="position"
                  value={basicData.position}
                  onChange={handleBasicChange}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.position ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position}</p>}
              </div>
              {/* Department */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={basicData.department}
                  onChange={handleBasicChange}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department}</p>}
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={personalLocation}
                  onChange={(e) => setPersonalLocation(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.personalLocation ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.personalLocation && <p className="text-sm text-red-500 mt-1">{errors.personalLocation}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.dob && <p className="text-sm text-red-500 mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-medium text-gray-700">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-lg font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.stateVal ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.stateVal && <p className="text-sm text-red-500 mt-1">{errors.stateVal}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Primary Phone</label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.primaryPhone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.primaryPhone && <p className="text-sm text-red-500 mt-1">{errors.primaryPhone}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Secondary Phone</label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.emergencyName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.emergencyName && <p className="text-sm text-red-500 mt-1">{errors.emergencyName}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.emergencyPhone && <p className="text-sm text-red-500 mt-1">{errors.emergencyPhone}</p>}
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Relationship</label>
                <input
                  type="text"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                  className={`w-full p-3 mt-1 border rounded-md ${errors.emergencyRelationship ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.emergencyRelationship && <p className="text-sm text-red-500 mt-1">{errors.emergencyRelationship}</p>}
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">National ID</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Passport Number</label>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">LinkedIn</label>
                <input
                  type="text"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Twitter</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full p-3 mt-1 border rounded-md border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Profile Picture</h3>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="p-2 border border-gray-300 rounded-md"
              />
              {employee.profilepicture && !profilePicFile && (
                <img
                  src={employee.profilepicture}
                  alt="Current profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              {profilePicFile && (
                <p className="text-gray-600">New file selected: {profilePicFile.name}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
