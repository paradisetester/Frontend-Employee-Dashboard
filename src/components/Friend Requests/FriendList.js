import React, { useState, useEffect } from 'react';
import api from '../../services/axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { FiSearch } from 'react-icons/fi';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [user, setUser] = useState({ id: '', name: '' });
  const [loadingFriends, setLoadingFriends] = useState(false);

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

  // Fetch friend list when user ID is available
  useEffect(() => {
    if (user.id) {
      fetchFriends();
    }
  }, [user.id]);

  // Fetch friend list using the provided API endpoint
  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const friendlistData = await api.getFriendList(user.id);
      // Assuming friendlistData has the structure: { friendList: { friends: [...] } }
      const friendsArray = Array.isArray(friendlistData.friendList.friends)
        ? friendlistData.friendList.friends
        : [friendlistData.friendList.friends];
      setFriends(friendsArray);
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
    setLoadingFriends(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, global: { value, matchMode: FilterMatchMode.CONTAINS } });
    setGlobalFilterValue(value);
  };

  // Template to render friend details
  const friendBodyTemplate = (friend) => {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {friend.profilepicture ? (
            <img
              src={friend.profilepicture}
              alt={friend.name}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl text-gray-500">{friend.name[0]}</span>
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold">{friend.name}</div>
          <div className="text-sm text-gray-500">{friend.position}</div>
        </div>
      </div>
    );
  };

  // Template to render email
  const emailBodyTemplate = (friend) => {
    return (
      <a href={`mailto:${friend.email}`} className="text-blue-500">
        {friend.email}
      </a>
    );
  };

  // Template to render social profiles
  const socialProfilesBodyTemplate = (friend) => {
    return (
      <div className="flex gap-2">
        {friend.socialProfiles?.linkedIn && (
          <a href={friend.socialProfiles.linkedIn} target="_blank" rel="noopener noreferrer">
            <i className="pi pi-linkedin text-xl text-blue-700"></i>
          </a>
        )}
        {friend.socialProfiles?.twitter && (
          <a href={friend.socialProfiles.twitter} target="_blank" rel="noopener noreferrer">
            <i className="pi pi-twitter text-xl text-blue-400"></i>
          </a>
        )}
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
            placeholder="Search friends..."
            value={globalFilterValue}
            onChange={handleSearchChange}
            className="pl-12 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <DataTable
          value={friends}
          paginator
          rows={5}
          filters={filters}
          loading={loadingFriends}
          globalFilterFields={['name', 'email', 'position']}
          emptyMessage={`No friends found${globalFilterValue ? ` matching "${globalFilterValue}"` : ''}`}
          className="p-datatable-customers"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Friend" body={friendBodyTemplate} sortable />
          <Column field="email" header="Email" body={emailBodyTemplate} sortable />
          <Column field="position" header="Position" sortable />
          <Column field="socialProfiles" header="Social Profiles" body={socialProfilesBodyTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default FriendList;
