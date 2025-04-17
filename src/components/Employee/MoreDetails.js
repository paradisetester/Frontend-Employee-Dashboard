import React from 'react';
import { FiX } from 'react-icons/fi';

const MoreDetails = ({ employee, onClose }) => {
  if (!employee) return null;
  const pd = employee.personaldetails;
  console.log(employee, 'employee');    

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Employee Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Profile Picture */}
           <div className="bg-gray-50 p-4 rounded shadow-sm flex flex-col items-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Profile Picture</h3>
            {employee.profilepicture ? (
              <img
                src={employee.profilepicture}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : (
              <p>No profile picture available.</p>
            )}
          </div>
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Basic Information</h3>
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Age:</strong> {employee.age}</p>
            <p><strong>Salary:</strong> {employee.salary}</p>
            <p><strong>Position:</strong> {employee.position}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Role:</strong> {employee.role}</p>
          </div>

          {/* Personal Details */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Personal Details</h3>
            {employee.personaldetails ? (
              <div>
                <p><strong>Location:</strong> {pd.location}</p>
                <p><strong>Date of Birth:</strong> {new Date(pd.dob).toLocaleDateString()}</p>
                <p><strong>Gender:</strong> {pd.gender}</p>
                <p><strong>Marital Status:</strong> {pd.maritalStatus}</p>
                <p><strong>Nationality:</strong> {pd.nationality}</p>
              </div>
            ) : (
              <p>No personal details available.</p>
            )}
          </div>

          {/* Address */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Address</h3>
            {employee.address ? (
              <div>
                <p><strong>Street:</strong> {employee.address.street}</p>
                <p><strong>City:</strong> {employee.address.city}</p>
                <p><strong>State:</strong> {employee.address.state}</p>
                <p><strong>Zip Code:</strong> {employee.address.zipCode}</p>
                <p><strong>Country:</strong> {employee.address.country}</p>
              </div>
            ) : (
              <p>No address details available.</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Contact Information</h3>
            {employee.contact ? (
              <div>
                <p><strong>Primary Phone:</strong> {employee.contact.primaryPhone}</p>
                <p><strong>Secondary Phone:</strong> {employee.contact.secondaryPhone || 'N/A'}</p>
              </div>
            ) : (
              <p>No contact information available.</p>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Emergency Contact</h3>
            {employee.emergencyContact ? (
              <div>
                <p><strong>Name:</strong> {employee.emergencyContact.name}</p>
                <p><strong>Phone:</strong> {employee.emergencyContact.phone}</p>
                <p><strong>Relationship:</strong> {employee.emergencyContact.relationship}</p>
              </div>
            ) : (
              <p>No emergency contact available.</p>
            )}
          </div>

          {/* Identification */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Identification</h3>
            {employee.identification ? (
              <div>
                <p><strong>National ID:</strong> {employee.identification.nationalId || 'N/A'}</p>
                <p><strong>Passport Number:</strong> {employee.identification.passportNumber || 'N/A'}</p>
              </div>
            ) : (
              <p>No identification details available.</p>
            )}
          </div>

          {/* Social Profiles */}
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Social Profiles</h3>
            {employee.socialProfiles ? (
              <div>
                <p><strong>LinkedIn:</strong> {employee.socialProfiles.linkedIn || 'N/A'}</p>
                <p><strong>Twitter:</strong> {employee.socialProfiles.twitter || 'N/A'}</p>
              </div>
            ) : (
              <p>No social profiles available.</p>
            )}
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default MoreDetails;
