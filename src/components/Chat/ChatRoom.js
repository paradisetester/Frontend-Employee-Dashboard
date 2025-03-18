import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../services/SocketContext';
import api from '../../services/axios';

const ChatRoom = () => {
  const { roomId } = useParams();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null); // To scroll to the latest message
  const [typingUser, setTypingUser] = useState('');

  // Fetch initial messages when the room is loaded
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.getMessages(roomId);
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    socket.emit('join-room', roomId);

    // Listen for incoming messages
    socket.on('new-message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Listen for typing status
    socket.on('typing', (username) => {
      setTypingUser(username);
    });

    return () => {
      socket.emit('leave-room', roomId);
      socket.off('new-message');
      socket.off('typing');
    };
  }, [roomId, socket]);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send-message', { roomId, content: message });
      setMessage('');
    }
  };

  // Handle typing event
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', 'User'); // Send the typing status to the server
    } else {
      clearTimeout(typingTimeout);
    }

    // Timeout to reset typing status after a short delay
    const typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit('stop-typing');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat Room</h2>

      {/* Messages List */}
      <div className="h-80 overflow-y-auto mb-4 p-3 border-b border-gray-300">
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg._id} className="flex space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                {msg.senderName ? msg.senderName[0].toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{msg.senderName}</span>
                <p className="text-gray-600">{msg.content}</p>
                <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Typing Indicator */}
      {typingUser && (
        <div className="text-sm text-gray-500 mb-4">
          {typingUser} is typing...
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
