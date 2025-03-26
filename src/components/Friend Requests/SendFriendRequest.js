import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const AddFriendList = () => {
  const [employees, setEmployees] = useState([]);
  const [friends, setFriends] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [user, setUser] = useState({ id: '', name: '' });
  const [sentRequests, setSentRequests] = useState({}); // mapping: employeeId -> status

  // Decode token to get current user info
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

  // Fetch employees and friend requests once user ID is available
  useEffect(() => {
    fetchEmployees();
    if (user.id) {
      fetchSentRequests();
    }
  }, [user.id]);

  // Fetch all employees from the API
  const fetchEmployees = async () => {
    try {
      const response = await api.getEmployees();
      setEmployees(response);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Fetch ALL friend requests sent by the user (using our new route)
  const fetchSentRequests = async () => {
    try {
      const response = await api.getSentRequestsAll(user.id); // Get the requests sent by the user
      // Assume the response structure is { message, requests }
      const requests = Array.isArray(response.requests)
        ? response.requests
        : [response.requests];
      const requestMapping = {};
      requests.forEach(req => {
        const targetId =
          typeof req.to === 'object' && req.to.$oid ? req.to.$oid : req.to;
        requestMapping[targetId] = req.status;
      });
      console.log('Sent friend requests:', requestMapping);
      setSentRequests(requestMapping);
      const friendlistdata = await api.getFriendList(user.id);

      // Ensure friends is always an array
      const friendlistData = Array.isArray(friendlistdata.friendList.friends)
        ? friendlistdata.friendList.friends
        : [friendlistdata.friendList.friends];

      setFriends(friendlistData);
    } catch (error) {
      console.error('Error fetching sent friend requests:', error);
    }
  };
  // Log friends whenever it changes
  useEffect(() => {
    console.log(friends, 'Updated friends');
  }, [friends]);
  // Update filters for global search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      global: { value, matchMode: FilterMatchMode.CONTAINS }
    });
    setGlobalFilterValue(value);
  };

  // Handle sending a friend request
  const handleAddFriend = async (employeeId) => {
    const requestData = {
      from: user.id,   // ID of the logged-in user
      to: employeeId   // ID of the employee to be added as friend
    };
    try {
      const response = await api.sendRequest(requestData);
      console.log('Friend request sent:', response.data);
      // Mark the employee with a 'Pending' request
      setSentRequests(prev => ({ ...prev, [employeeId]: 'Pending' }));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Show all employees except the current user
  const filteredEmployees = employees.filter(employee =>
    employee._id !== user.id && !friends.some(friend => friend._id === employee._id)
  );
  
  // Render the action column based on request status
  const addFriendBodyTemplate = (rowData) => {
    const status = sentRequests[rowData._id];
    if (status) {
      if (status === 'Rejected') {
        // If rejected, allow resending the request by showing the Add Friend icon
        return (
          <button
            onClick={() => handleAddFriend(rowData._id)}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <FiUserPlus size={18} />
          </button>
        );
      } else if (status === 'Pending') {
        // If pending, show a label with "Pending"
        return (
          <span className="p-2 bg-gray-300 text-gray-800 rounded">
            Pending
          </span>
        );
      } else if (status === 'Accepted') {
        // If accepted, show a label with "Already Friends"
        return (
          <span className="p-2 bg-blue-500 text-white rounded">
            Already Friends
          </span>
        );
      }
    }
    // No friend request exists; show the Add Friend button
    return (
      <button
        onClick={() => handleAddFriend(rowData._id)}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        <FiUserPlus size={18} />
      </button>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees by name, email, position, or department..."
            value={globalFilterValue}
            onChange={handleSearchChange}
            className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <DataTable
          value={filteredEmployees}
          paginator
          rows={5}
          filters={filters}
          globalFilterFields={['name', 'email', 'position', 'department']}
          emptyMessage={`No employees found${globalFilterValue ? ` matching "${globalFilterValue}"` : ''}`}
          className="p-datatable-customers"
        >
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="position" header="Position" sortable />
          <Column field="department" header="Department" sortable />
          <Column header="Actions" body={addFriendBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default AddFriendList;
