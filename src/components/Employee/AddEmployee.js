import React, { useState } from 'react';
import api from '../../services/axios';

const AddEmployee = () => {
  // Basic employee fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [salary, setSalary] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('employee');
  const [password, setPassword] = useState('');

  // New nested fields for the updated model
  // Personal details (using one object inside an array)
  const [personalLocation, setPersonalLocation] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');
  const [maritalStatus, setMaritalStatus] = useState('single');
  const [nationality, setNationality] = useState('');

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  // Contact fields
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');

  // Emergency Contact fields
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');

  // Identification fields
  const [nationalId, setNationalId] = useState('');
  const [passportNumber, setPassportNumber] = useState('');

  // Social Profiles
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');

  // Profile picture file
  const [profilePicFile, setProfilePicFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Prepare FormData to handle file and JSON fields
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('age', age);
    formData.append('salary', salary);
    formData.append('position', position);
    formData.append('department', department);
    formData.append('role', role);

    // Nested fields are stringified as JSON.
    const personalDetails = [{
      location: personalLocation,
      dob,
      gender,
      maritalStatus,
      nationality
    }];
    formData.append('personaldetails', JSON.stringify(personalDetails));

    const addressObj = { street, city, state: stateVal, zipCode, country };
    formData.append('address', JSON.stringify(addressObj));

    const contactObj = { primaryPhone, secondaryPhone };
    formData.append('contact', JSON.stringify(contactObj));

    const emergencyObj = { name: emergencyName, phone: emergencyPhone, relationship: emergencyRelationship };
    formData.append('emergencyContact', JSON.stringify(emergencyObj));

    const identificationObj = { nationalId, passportNumber };
    formData.append('identification', JSON.stringify(identificationObj));

    const socialProfilesObj = { linkedIn, twitter };
    formData.append('socialProfiles', JSON.stringify(socialProfilesObj));

    if (profilePicFile) {
      formData.append('profilepicture', profilePicFile);
    } else {
      setErrorMessage('Profile picture is required.');
      setIsLoading(false);
      return;
    }

    try {
      // Make sure your api.addEmployee method supports sending FormData (multipart/form-data)
      await api.addEmployee(formData);
      alert('Employee added successfully');
      setIsLoading(false);

      // Reset fields
      setName('');
      setEmail('');
      setAge('');
      setSalary('');
      setPosition('');
      setDepartment('');
      setRole('employee');
      setPassword('');
      setPersonalLocation('');
      setDob('');
      setGender('male');
      setMaritalStatus('single');
      setNationality('');
      setStreet('');
      setCity('');
      setStateVal('');
      setZipCode('');
      setCountry('');
      setPrimaryPhone('');
      setSecondaryPhone('');
      setEmergencyName('');
      setEmergencyPhone('');
      setEmergencyRelationship('');
      setNationalId('');
      setPassportNumber('');
      setLinkedIn('');
      setTwitter('');
      setProfilePicFile(null);
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('Failed to add employee. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Add New Employee
      </h2>

      {errorMessage && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded-md text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basic Fields */}
          <div>
            <label className="block text-gray-600 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Age</label>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Salary</label>
            <input
              type="number"
              placeholder="Salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Position</label>
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Department</label>
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Profile Picture */}
          <div className="sm:col-span-2">
            <label className="block text-gray-600 font-medium mb-2">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicFile(e.target.files[0])}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Personal Details */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mt-4 mb-2">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Location</label>
                <input
                  type="text"
                  placeholder="Location"
                  value={personalLocation}
                  onChange={(e) => setPersonalLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600">Nationality</label>
                <input
                  type="text"
                  placeholder="Nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mt-4 mb-2">Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Street</label>
                <input
                  type="text"
                  placeholder="Street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Zip Code</label>
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600">Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mt-4 mb-2">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Primary Phone</label>
                <input
                  type="text"
                  placeholder="Primary Phone"
                  value={primaryPhone}
                  onChange={(e) => setPrimaryPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Secondary Phone</label>
                <input
                  type="text"
                  placeholder="Secondary Phone"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mt-4 mb-2">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-600">Name</label>
                <input
                  type="text"
                  placeholder="Emergency Contact Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Phone</label>
                <input
                  type="text"
                  placeholder="Emergency Contact Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Relationship</label>
                <input
                  type="text"
                  placeholder="Relationship"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mt-4 mb-2">Identification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">National ID</label>
                <input
                  type="text"
                  placeholder="National ID"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Passport Number</label>
                <input
                  type="text"
                  placeholder="Passport Number"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="sm:col-span-2">
            <h3 className="text-xl font-semibold mt-4 mb-2">Social Profiles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">LinkedIn</label>
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600">Twitter</label>
                <input
                  type="text"
                  placeholder="Twitter URL"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 p-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          {isLoading ? 'Adding Employee...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
