import React from 'react';
import { FiX } from 'react-icons/fi';

const MoreDetails = ({ employee, onClose }) => {
  if (!employee) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Employee Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Basic Information</h3>
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Age:</strong> {employee.age}</p>
            <p><strong>Salary:</strong> {employee.salary}</p>
            <p><strong>Position:</strong> {employee.position}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Role:</strong> {employee.role}</p>
          </div>
          {/* Personal Details */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Personal Details</h3>
            {employee.personaldetails && employee.personaldetails.length > 0 ? (
              employee.personaldetails.map((pd, index) => (
                <div key={index} className="mb-2">
                  <p><strong>Location:</strong> {pd.location}</p>
                  <p>
                    <strong>Date of Birth:</strong> {new Date(pd.dob).toLocaleDateString()}
                  </p>
                  <p><strong>Gender:</strong> {pd.gender}</p>
                  <p><strong>Marital Status:</strong> {pd.maritalStatus}</p>
                  <p><strong>Nationality:</strong> {pd.nationality}</p>
                </div>
              ))
            ) : (
              <p>No personal details available.</p>
            )}
          </div>
          {/* Address */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Address</h3>
            {employee.address ? (
              <>
                <p><strong>Street:</strong> {employee.address.street}</p>
                <p><strong>City:</strong> {employee.address.city}</p>
                <p><strong>State:</strong> {employee.address.state}</p>
                <p><strong>Zip Code:</strong> {employee.address.zipCode}</p>
                <p><strong>Country:</strong> {employee.address.country}</p>
              </>
            ) : (
              <p>No address details available.</p>
            )}
          </div>
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Contact Information</h3>
            {employee.contact ? (
              <>
                <p><strong>Primary Phone:</strong> {employee.contact.primaryPhone}</p>
                <p>
                  <strong>Secondary Phone:</strong> {employee.contact.secondaryPhone || 'N/A'}
                </p>
              </>
            ) : (
              <p>No contact information available.</p>
            )}
          </div>
          {/* Emergency Contact */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Emergency Contact</h3>
            {employee.emergencyContact ? (
              <>
                <p><strong>Name:</strong> {employee.emergencyContact.name}</p>
                <p><strong>Phone:</strong> {employee.emergencyContact.phone}</p>
                <p>
                  <strong>Relationship:</strong> {employee.emergencyContact.relationship}
                </p>
              </>
            ) : (
              <p>No emergency contact available.</p>
            )}
          </div>
          {/* Identification */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Identification</h3>
            {employee.identification ? (
              <>
                <p>
                  <strong>National ID:</strong> {employee.identification.nationalId || 'N/A'}
                </p>
                <p>
                  <strong>Passport Number:</strong> {employee.identification.passportNumber || 'N/A'}
                </p>
              </>
            ) : (
              <p>No identification details available.</p>
            )}
          </div>
          {/* Social Profiles */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Social Profiles</h3>
            {employee.socialProfiles ? (
              <>
                <p>
                  <strong>LinkedIn:</strong> {employee.socialProfiles.linkedIn || 'N/A'}
                </p>
                <p>
                  <strong>Twitter:</strong> {employee.socialProfiles.twitter || 'N/A'}
                </p>
              </>
            ) : (
              <p>No social profiles available.</p>
            )}
          </div>
          {/* Profile Picture */}
          <div>
            <h3 className="text-xl font-medium text-gray-700">Profile Picture</h3>
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
        </div>
      </div>
    </div>
  );
};

export default MoreDetails;
