import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatMessaging from './ChatMessaging';

const ChatApp = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleJoinRoom = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen ">
      {/* Chat Room List */}
      <div className="w-full md:w-1/3 p-4">
        <h2 className="text-lg font-semibold mb-4">Chat Rooms</h2>
        <ChatRoomList onJoinRoom={handleJoinRoom} />
      </div>

      {/* Chat Messaging Area */}
      <div className="w-full md:w-2/3 p-4 flex items-center justify-left">
        {selectedRoom ? (
          <ChatMessaging selectedRoom={selectedRoom} />
        ) : (
          <div className="text-gray-500 text-center text-lg">
            Select a room to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
