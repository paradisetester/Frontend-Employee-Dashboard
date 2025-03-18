import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/axios';
import { getToken } from '../../services/authService';
import {jwtDecode} from 'jwt-decode'; // Corrected default import for jwt-decode

const LeaveStatusPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const leavesPerPage = 5;
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch leaves data on component mount
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No token provided');
        }
        const decodedToken = jwtDecode(token);
        const employeeId = decodedToken.employeeId;
        console.log('employeeId:', employeeId);
        const leaveData = await api.myLeaves(employeeId);
        setLeaves(leaveData);
      } catch (err) {
        console.error('Error fetching leaves:', err);
        setError(err?.response?.data?.message || err.message || 'Failed to fetch leaves');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // Memoize filtered leaves for better performance
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) =>
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leaves, searchTerm]);

  // Paginate filtered leaves
  const currentLeaves = useMemo(() => {
    const indexOfLastLeave = currentPage * leavesPerPage;
    const indexOfFirstLeave = indexOfLastLeave - leavesPerPage;
    return filteredLeaves.slice(indexOfFirstLeave, indexOfLastLeave);
  }, [filteredLeaves, currentPage, leavesPerPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (leaveId) => {
    setDeleting(true);
    try {
      await api.deleteLeave(leaveId);
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveId));
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting leave:', err);
      setError(err?.response?.data?.message || 'Failed to delete leave');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (leave) => {
    if (['pending', 'rejected'].includes(leave.status)) {
      setSelectedLeave(leave);
      setShowDeleteModal(true);
    }
  };

  const closeDeleteModal = () => {
    setSelectedLeave(null);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" role="status" aria-label="Loading"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <p className="text-red-500 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">My Leave Status</h2>

      {/* Search Input */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          className="border px-4 py-2 w-1/3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by reason or status"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
        />
      </div>

      {filteredLeaves.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No leave records found.</p>
      ) : (
        <>
          {/* Leave Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Start Date</th>
                  <th className="py-2 px-4 text-left">End Date</th>
                  <th className="py-2 px-4 text-left">Reason</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Applied On</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLeaves.map((leave) => (
                  <tr key={leave._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{leave.reason}</td>
                    <td
                      className={`py-2 px-4 border-b font-medium ${
                        leave.status === 'approved'
                          ? 'text-green-600'
                          : leave.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {leave.status}
                    </td>
                    <td className="py-2 px-4 border-b">{new Date(leave.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      {['pending', 'rejected'].includes(leave.status) && (
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                          onClick={() => openDeleteModal(leave)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded-l ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * leavesPerPage >= filteredLeaves.length}
              className={`px-4 py-2 bg-blue-500 text-white rounded-r ${
                currentPage * leavesPerPage >= filteredLeaves.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this leave?</h3>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => handleDelete(selectedLeave._id)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveStatusPage;
