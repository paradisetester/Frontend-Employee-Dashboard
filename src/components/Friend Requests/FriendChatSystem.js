// FriendChatSystem.js
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../services/SocketContext';
import api from '../../services/axios';
import { getToken } from '../../services/authService';
import {jwtDecode} from 'jwt-decode';
import { formatDistanceToNow } from 'date-fns';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { ProgressSpinner } from 'primereact/progressspinner';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

// ========================
// FriendList Component
// ========================
const FriendList = ({ userId, onSelectFriend, selectedFriendId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch friend list when userId changes.
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const response = await api.getFriendList(userId);
        // Assuming response.data.friendList.friends is an array of friend objects.
        const friendArray = response?.data?.friendList?.friends || [];
        setFriends(friendArray);
      } catch (error) {
        console.error('Error fetching friend list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFriendList();
    }
  }, [userId]);

  // Helper to extract friend ID as a string.
  const getFriendIdString = (friend) => {
    if (friend && friend._id) {
      return friend._id.toString();
    }
    return friend.toString();
  };

  return (
    <div className="friend-list p-4">
      <h3 className="mb-4">Your Friends</h3>
      {loading ? (
        <ProgressSpinner />
      ) : friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => {
            const friendIdStr = getFriendIdString(friend);
            return (
              <li
                key={friendIdStr}
                className={`cursor-pointer p-2 rounded ${
                  selectedFriendId === friendIdStr ? 'bg-blue-200' : 'hover:bg-blue-100'
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

// ========================
// DirectChatWindow Component
// ========================
// This component handles direct messaging between two users without creating persistent chatrooms.
const DirectChatWindow = ({ user, friend }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch direct messages between the two users.
  useEffect(() => {
    const fetchDirectMessages = async () => {
      try {
        // Your backend should support filtering direct messages by both user IDs.
        const messagesResponse = await api.getDirectMessages(user.id, friend.id);
        setMessages(messagesResponse);
      } catch (error) {
        console.error('Error fetching direct messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id && friend.id) {
      fetchDirectMessages();
    }
  }, [user.id, friend.id]);

  // Listen for incoming direct messages.
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        // Check if the message is between these two users.
        if (
          (message.sender.id === friend.id && message.reciever === user.id) ||
          (message.sender.id === user.id && message.reciever === friend.id)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on('newMessage', handleNewMessage);
      return () => socket.off('newMessage', handleNewMessage);
    }
  }, [socket, user.id, friend.id]);

  // Auto-scroll to the bottom when messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a direct message.
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      sender: { id: user.id, name: user.name },
      reciever: friend.id,
      timestamp: new Date().toISOString(),
    };

    // Emit the direct message.
    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <div className="chat-window flex flex-col h-full">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ProgressSpinner className="w-12 h-12" />
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="p-4 bg-gray-100 border-b">
            <h2 className="text-xl font-bold">Chat with {friend.name}</h2>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">
                No messages yet. Start the conversation!
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id || uuidv4()}
                  className={`p-3 rounded-lg flex flex-col max-w-[70%] ${
                    msg.sender.id === user.id
                      ? 'self-end bg-blue-500 text-white'
                      : 'self-start bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <strong>{msg.sender.name}</strong>
                    <small className="text-xs opacity-75">
                      {msg.timestamp &&
                        formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </small>
                  </div>
                  <div
                    className="mt-1"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(msg.content),
                    }}
                  />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-gray-100 border-t">
            <Editor
              value={newMessage}
              onTextChange={(e) => setNewMessage(e.htmlValue || '')}
              placeholder="Write your message..."
              style={{ height: '120px', border: 'none', boxShadow: 'none' }}
            />
            <div className="flex justify-end mt-2">
              <Button
                label="Send"
                icon="pi pi-send"
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

// ========================
// Parent FriendChatSystem Component
// ========================
const FriendChatSystem = () => {
  const [user, setUser] = useState({ id: '', name: '' });
  const [selectedFriend, setSelectedFriend] = useState(null);
  const socket = useSocket();

  // On mount, join the user's personal room for direct messages.
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

  return (
    <div className="friend-chat-system flex h-screen">
      {/* Left Sidebar: Friend List */}
      <div className="w-1/4 border-r overflow-y-auto">
        {user.id && (
          <FriendList
            userId={user.id}
            onSelectFriend={setSelectedFriend}
            selectedFriendId={selectedFriend?.id}
          />
        )}
      </div>

      {/* Right Panel: Direct Chat Window */}
      <div className="w-3/4">
        {selectedFriend ? (
          <DirectChatWindow user={user} friend={selectedFriend} />
        ) : (
          <div className="flex items-center justify-center h-full text-lg text-gray-500">
            Please select a friend to chat with.
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendChatSystem;
