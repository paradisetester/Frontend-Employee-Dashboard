import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../services/SocketContext';
import api from '../../services/axios';
import { format } from 'date-fns';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid'; // For unique message IDs
import { Editor } from 'primereact/editor';
import DOMPurify from 'dompurify'; // Install via `npm install dompurify`
import { ProgressSpinner } from 'primereact/progressspinner';
import { formatDistanceToNow } from 'date-fns';
import { Button } from 'primereact/button';

const ChatMessaging = ({ selectedRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState({ id: '', name: '' });
  const [loading, setLoading] = useState(true); // Track loading state
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // Decode token to retrieve user details
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

  // Fetch messages and handle socket events
  useEffect(() => {
    if (!selectedRoom || !selectedRoom.id) return;

    const fetchMessages = async () => {
      try {
        const data = await api.getMessages(selectedRoom.id);
        setMessages(
          data.map((msg) => ({
            ...msg,
            sender: msg.sender || { name: 'Unknown', id: null },
          }))
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();

    if (socket) {
      // Join the selected room
      socket.emit('joinRoom', selectedRoom.id);

      // Listen for new messages in real-time
      socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...message,
            sender: message.sender || { name: 'Unknown', id: null },
          },
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', selectedRoom.id);
        socket.off('newMessage');
      }
    };
  }, [socket, selectedRoom]);

  // Handle sending a new message

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      sender: {
        id: user.id,
        name: user.name, // Add sender name
      },
      room: selectedRoom.id,
      timestamp: new Date().toISOString(),
    };

    // Emit the message to the server via socket
    socket.emit('sendMessage', messageData);

    // Update UI immediately
    const tempMessage = {
      id: uuidv4(),
      ...messageData,
      status: 'sending',
    };

    // setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
  };


  const handleRetryMessage = async (failedMessage) => {
    try {
      const response = await api.sendMessage({
        content: failedMessage.content,
        sender: user.id,
        room: selectedRoom.id
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === failedMessage.id
            ? {
              ...msg,
              ...response,
              status: 'sent',
              sender: { name: user.name, id: user.id },

            }
            : msg
        )
      );
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  // Scroll handling
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSendMessage();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [newMessage]);
  // UI helpers
  const getSenderColor = (senderName) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead', '#ff9999'];
    const index = Math.abs(senderName?.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };
  if (!selectedRoom || !selectedRoom.id) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-gray-600">
        Please select a valid room to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-2 p-4 bg-surface-50 dark:bg-surface-900">
      {/* Room header */}
      <div className="flex items-center gap-3 p-4 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm">
        <i className="pi pi-comments text-2xl text-primary-500" />
        <div>
          <h2 className="text-xl font-bold m-0">{selectedRoom.name}</h2>
          <small className="text-surface-500">
            {messages.length} messages • {selectedRoom?.members?.length || 0} participants
          </small>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ProgressSpinner className="w-12 h-12" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-surface-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg flex items-start gap-3 max-w-[85%] shadow-sm ${msg.sender?.id === user.id
                  ? ' bg-primary-500 '
                  : 'mr-auto bg-surface-100 dark:bg-surface-700'
                  }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: getSenderColor(msg.sender?.name) }}
                >
                  {msg.sender?.name?.[0]?.toUpperCase() || 'U'}
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-semibold">
                      {msg.sender?.name || 'Unknown'}
                    </strong>
                    <span className="text-xs opacity-75">
                      {msg.timestamp && formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <div
                    className="message-content text-sm break-words"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }}
                  />
                  {msg.status === 'sending' && (
                    <div className="text-sm text-yellow-600 mt-2">🕒 Sending...</div>
                  )}
                  {msg.status === 'failed' && (
                    <Button
                      icon="pi pi-replay"
                      className="p-button-text p-button-sm p-button-danger"
                      onClick={() => handleRetryMessage(msg)}
                      tooltip="Retry sending"
                      tooltipOptions={{ position: 'top' }}
                    />
                  )}

                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input */}
      <div className={`p-2 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-lg transition-all ${isEditorFocused ? 'ring-2 ring-primary-500' : ''
        }`}>
        <Editor
          value={newMessage}
          onTextChange={(e) => setNewMessage(e.htmlValue || '')}
          placeholder="Write your message..."
          style={{
            height: '120px',
            border: 'none',
            boxShadow: 'none',
          }}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
        />
        <div className="flex justify-between items-center p-2">
          <small className="text-surface-500">
            Press Ctrl+Enter to send
          </small>
          <Button
            label="Send"
            icon="pi pi-send"
            className="p-button-primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !user.name}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessaging;
