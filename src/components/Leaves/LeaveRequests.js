import React, { useEffect, useState } from 'react';
import api from '../../services/axios';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);  // Start with an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.getLeaves();
        console.log("API Response Data:", response);  // Log the response data
        // Check if response data is an array before updating the state
        if (Array.isArray(response)) {
          setLeaves(response);
        } else {
          setError('Invalid response format.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch leave requests');
      }
    };

    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const role = localStorage.role;
      await api.updateLeaveStatus(id, status, role);
      alert(`✅ Leave successfully marked as ${status}`);
      // Refresh leaves
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === id ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      console.error(err);
      setError(`Failed to update leave status to ${status}`);
    }
  };

  const handleDeleteLeave = async (id) => {
    try {
      await api.deleteLeave(id);  // Call the API to delete the leave
      alert('✅ Leave request deleted successfully');
      // Remove the deleted leave from state
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete leave request');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📋 Leave Requests</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-2">Employee</th>
            <th className="p-2">Position</th>
            <th className="p-2">Start Date</th>
            <th className="p-2">End Date</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Ensure leaves is an array before trying to map */}
          {Array.isArray(leaves) && leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave._id} className="text-center border-b">
                <td className="p-2">{leave.employee?.name || 'N/A'}</td>
                <td className="p-2">{leave.employee?.position || 'N/A'}</td>
                <td className="p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                <td className="p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
                <td className="p-2">{leave.reason}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      leave.status === 'pending'
                        ? 'bg-yellow-500'
                        : leave.status === 'approved'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td className="p-2">
                  {leave.status === 'pending' && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdateStatus(leave._id, 'approved')}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDeleteLeave(leave._id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">No leave requests available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
