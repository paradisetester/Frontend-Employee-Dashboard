// FriendChatSystem.js
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../services/SocketContext';
import api from '../../services/axios';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import { formatDistanceToNow } from 'date-fns';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { ProgressSpinner } from 'primereact/progressspinner';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

// ------------------------
// FriendList Component
// ------------------------
const FriendList = ({ userId, onSelectFriend, selectedFriendId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const response = await api.getFriendList(userId);
        const friendArray = response?.friendList?.friends || [];
        setFriends(friendArray);
      } catch (error) {
        console.error('Error fetching friend list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchFriendList();
  }, [userId]);

  const getFriendIdString = (friend) =>
    friend && friend._id ? friend._id.toString() : friend.toString();

  return (
    <div className="friend-list p-4 bg-white shadow-md rounded-lg">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Your Friends</h3>
      {loading ? (
        <ProgressSpinner />
      ) : friends.length === 0 ? (
        <p className="text-gray-500">No friends found.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => {
            const friendIdStr = getFriendIdString(friend);
            return (
              <li
                key={friendIdStr}
                className={`cursor-pointer p-2 rounded transition-colors ${selectedFriendId === friendIdStr
                    ? 'bg-blue-200'
                    : 'hover:bg-blue-100'
                  }`}
                onClick={() =>
                  onSelectFriend({
                    id: friendIdStr,
                    name: friend.name || `Friend ${friendIdStr.slice(-4)}`,
                  })
                }
              >
                {friend.name ? friend.name : `Friend ${friendIdStr.slice(-4)}`}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ------------------------
// PrivateChatWindow Component
// ------------------------
const PrivateChatWindow = ({ user, friend, room }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const header = renderHeader();
  // Join the room on mount
  useEffect(() => {
    if (socket && room._id) {
      socket.emit('joinRoom', room._id);
    }
  }, [socket, room._id]);

  // Fetch messages for this room
  useEffect(() => {
    const fetchRoomMessages = async () => {
      try {
        const roomMessages = await api.getMessages(room._id);
        setMessages(roomMessages);
      } catch (error) {
        console.error('Error fetching room messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (room._id) fetchRoomMessages();
  }, [room._id]);

  // Listen for new messages and typing events
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        if (message.room === room._id) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const handleTyping = (data) => {
        if (data.room === room._id && data.userId !== user.id) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      };

      socket.on('newMessage', handleNewMessage);
      socket.on('userTyping', handleTyping);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('userTyping', handleTyping);
      };
    }
  }, [socket, room._id, user.id]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      sender: { id: user.id, name: user.name },
      room: room._id,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  // Emit typing event when user types
  const handleTypingEvent = () => {
    socket.emit('typing', { room: room._id, userId: user.id });
  };

  // Send on Ctrl+Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [newMessage]);

  return (
    <div className="chat-window flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-4 gap-2 rounded-xl shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ProgressSpinner className="w-12 h-12" />
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl shadow-sm">
            <i className="pi pi-comments text-2xl" />
            <h2 className="text-xl font-bold">Chat with {friend.name}</h2>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-300">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id || uuidv4()}
                  className={`p-3 rounded-lg max-w-md shadow-sm ${msg.sender.id === user.id
                      ? 'self-end bg-blue-500 text-white'
                      : 'self-start bg-gray-200 text-gray-800'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm">{msg.sender.name}</strong>
                    <small className="text-xs opacity-75">
                      {msg.timestamp &&
                        formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </small>
                  </div>
                  <div
                    className="text-sm break-words"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(msg.content),
                    }}
                  />
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {typing && (
              <div className="self-start px-3 py-2 bg-gray-300 rounded-lg max-w-xs shadow">
                <span className="text-sm text-gray-700 italic">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div
            className={`p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all ${newMessage ? 'ring-2 ring-blue-500' : ''
              }`}
          >
            <Editor
              value={newMessage}
              onTextChange={(e) => {
                setNewMessage(e.htmlValue || '');
                handleTypingEvent();
              }}
              headerTemplate={header}
              placeholder="Write your message..."
              style={{ height: '120px', border: 'none', boxShadow: 'none' }}
            />
            <div className="flex justify-between items-center p-2">
              <small className="text-gray-500 dark:text-gray-400">
                Press Ctrl+Enter to send
              </small>
              <Button
                label="Send"
                icon="pi pi-send"
                className="p-button-primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ------------------------
// Parent FriendChatSystem Component
// ------------------------
const FriendChatSystem = () => {
  const [user, setUser] = useState({ id: '', name: '' });
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const socket = useSocket();

  // Detect mobile view on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Join the user's personal room on mount.
  useEffect(() => {
    if (socket && user.id) {
      socket.emit('joinUserRoom', user.id);
    }
  }, [socket, user.id]);

  // Decode JWT to get current user details.
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, name: decoded.name });
    }
  }, []);

  // When a friend is selected, check for an existing private room or create a new one.
  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend);
    if (!user.id || !friend.id) return;

    try {
      // Fetch all chatrooms for the current user.
      const rooms = await api.getRooms(user.id);
      // Look for a private room that includes both the current user and the selected friend.
      const existingRoom = rooms.find(
        (room) =>
          room.type === 'private' &&
          room.members.some((m) => m._id.toString() === friend.id) &&
          room.members.some((m) => m._id.toString() === user.id)
      );

      if (existingRoom) {
        setSelectedRoom(existingRoom);
      } else {
        // Create a new private room.
        const roomName = `Chat: ${user.name} & ${friend.name}`;
        const newRoomData = {
          name: roomName,
          type: 'private',
          members: [user.id, friend.id],
        };
        const response = await api.createRoom(newRoomData);
        if (response && response.chatroom) {
          setSelectedRoom(response.chatroom);
        }
      }
    } catch (error) {
      console.error('Error handling friend selection and room creation:', error);
    }
  };

  // Back button for mobile view
  const handleBackToFriends = () => {
    setSelectedFriend(null);
    setSelectedRoom(null);
  };

  if (isMobile) {
    // Mobile view: show friend list or chat window
    return (
      <div className="friend-chat-system h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        {selectedRoom ? (
          <div className="h-full flex flex-col">
            <div className="p-4 bg-blue-600 text-white flex items-center">
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                className="p-button-text"
                onClick={handleBackToFriends}
              />
              <h2 className="ml-2 text-xl font-bold">Chat with {selectedFriend.name}</h2>
            </div>
            <div className="flex-1">
              <PrivateChatWindow user={user} friend={selectedFriend} room={selectedRoom} />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {user.id && (
              <FriendList
                userId={user.id}
                onSelectFriend={handleSelectFriend}
                selectedFriendId={selectedFriend?.id}
              />
            )}
          </div>
        )}
      </div>
    );
  } else {
    // Desktop view: show friend list and chat side by side
    return (
      <div className="friend-chat-system flex h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-1/4 border-r overflow-y-auto p-4">
          {user.id && (
            <FriendList
              userId={user.id}
              onSelectFriend={handleSelectFriend}
              selectedFriendId={selectedFriend?.id}
            />
          )}
        </div>
        <div className="w-3/4">
          {selectedRoom ? (
            <PrivateChatWindow user={user} friend={selectedFriend} room={selectedRoom} />
          ) : (
            <div className="flex items-center justify-center h-full text-lg text-gray-500 dark:text-gray-300">
              Please select a friend to chat with.
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default FriendChatSystem;
