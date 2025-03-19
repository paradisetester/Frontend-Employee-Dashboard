import React, { useEffect, useState } from 'react';
import api from '../../services/axios';
import { useSocket } from '../../services/SocketContext';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import { FaSearch } from 'react-icons/fa'; // For search icon

const ChatRoomList = ({ onJoinRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5); // Limit the number of rooms per page
  const socket = useSocket();

  // Function to fetch rooms from API and filter out private rooms
  const fetchRooms = async () => {
    try {
      const token = getToken();
      const decodedToken = jwtDecode(token);
      const employeeId = decodedToken.id;
      const data = await api.getRooms(employeeId);
      // Filter out rooms where type is 'private'
      const nonPrivateRooms = data.filter(room => room.type !== 'private');
      setRooms(nonPrivateRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Filter rooms based on search query
  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchQuery, rooms]);

  // Handle pagination logic
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchRooms();

    if (socket) {
      socket.on('roomUpdated', fetchRooms);
    }

    return () => {
      if (socket) {
        socket.off('roomUpdated', fetchRooms);
      }
    };
  }, [socket]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-md mx-auto">
      {/* Search bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search rooms..."
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Available Rooms</h2>
      <ul className="space-y-2">
        {currentRooms.length === 0 ? (
          <p className="text-gray-500">No rooms available. Create one!</p>
        ) : (
          currentRooms.map((room) => (
            <li
              key={room._id}
              className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onJoinRoom({ id: room._id, name: room.name, members: room.members });
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                  {/* Placeholder for room avatar */}
                  {room.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800">{room.name}</span>
              </div>
              {/* Add online status indicator (could be a colored dot) */}
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      {filteredRooms.length > roomsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(filteredRooms.length / roomsPerPage) }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRoomList;
