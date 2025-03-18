import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [user, setUser] = useState({ id: '', name: '' });
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingRequest, setProcessingRequest] = useState(null);

  // Get current logged-in user
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({
        id: decodedToken.id,
        name: decodedToken.name,
      });
    }
  }, []);

  // Fetch friend requests when user ID is available
  useEffect(() => {
  
    if (user.id) {
      fetchRequests();
    }
  }, [user.id]);

  // Fetch friend requests using the provided API endpoint
  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const data = await api.getRequests(user.id);
      const friendlistdata=api.getFriendList(user.id);
      console.log(friendlistdata);
      setRequests(data.requests || data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
    setLoadingRequests(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } });
    setGlobalFilterValue(value);
  };

  // Accept friend request using provided API endpoints
// Accept friend request using provided API endpoints
const handleAccept = async (requestId, senderId) => {
  setProcessingRequest(requestId);
  try {
    // Accept the friend request on the backend
    await api.acceptRequest(requestId);
    
    // Update friend list for the current user
    await api.addFriend({ userId: user.id, friendId: senderId });
    
    // Update friend list for the sender
    await api.addFriend({ userId: senderId, friendId: user.id });
    
    // Remove accepted request from UI for current user
    setRequests((prevRequests) => prevRequests.filter(req => req._id !== requestId));
    // console.log(`Friend request from ${senderId} accepted and both friend lists updated.`);
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
  setProcessingRequest(null);
};


  // Reject friend request using the provided API endpoint
  const handleReject = async (requestId) => {
    setProcessingRequest(requestId);
    try {
      await api.rejectRequest(requestId);
      // Remove rejected request from UI
      setRequests((prevRequests) => prevRequests.filter(req => req._id !== requestId));
      console.log(`Friend request ${requestId} rejected`);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
    setProcessingRequest(null);
  };

  // Template for displaying sender information
  const senderBodyTemplate = (rowData) => {
    return (
      <div>
        <div>{rowData.from.name}</div>
        <div className="text-sm text-gray-500">{rowData.from.email}</div>
      </div>
    );
  };

  // Template for action buttons (Accept / Reject)
  const actionsBodyTemplate = (rowData) => {
    const isProcessing = processingRequest === rowData._id;
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleAccept(rowData._id, rowData.from._id)}
          className={`p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Accept"
          disabled={isProcessing}
        >
          <FiCheck size={18} />
        </button>
        <button
          onClick={() => handleReject(rowData._id)}
          className={`p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="Reject"
          disabled={isProcessing}
        >
          <FiX size={18} />
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search friend requests..."
            value={globalFilterValue}
            onChange={handleSearchChange}
            className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <DataTable
          value={requests}
          paginator
          rows={5}
          filters={filters}
          loading={loadingRequests}
          globalFilterFields={['from.name', 'from.email']}
          emptyMessage={`No friend requests found${globalFilterValue ? ` matching "${globalFilterValue}"` : ''}`}
          className="p-datatable-customers"
        >
          <Column header="From" body={senderBodyTemplate} sortable />
          <Column header="Actions" body={actionsBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default FriendRequests;
