import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../services/SocketContext';
import api from '../../services/axios';
import { formatDistanceToNow } from 'date-fns';
import { getToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import { Editor } from 'primereact/editor';
import DOMPurify from 'dompurify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

const ChatMessaging = ({ selectedRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState({ id: '', name: '' });
  const [loading, setLoading] = useState(true);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  // User initialization
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser({ id: decodedToken.id, name: decodedToken.name });
    }
  }, []);

  // Message fetching and socket setup
  useEffect(() => {
    if (!selectedRoom?.id) return;

    const fetchMessages = async () => {
      try {
        const data = await api.getMessages(selectedRoom.id);
        setMessages(data.map(msg => ({
          ...msg,
          sender: msg.sender || { name: 'Unknown', id: null }
        })));
        console.log('Messages:', data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };

    fetchMessages();

    if (socket) {
      socket.emit('joinRoom', selectedRoom.id);
      socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...message,
            sender: message.sender || { name: 'Unknown', id: null },
            status: 'sent',

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

  // Message handling
  const handleNewMessage = (message) => {
    setMessages(prev => {
      const exists = prev.some(msg => msg.id === message.id);
      return exists ? prev : [...prev, normalizeMessage(message)];
    });
  };
  
  const normalizeMessage = (message) => ({
    ...message,
    sender: message.sender || { name: 'Unknown', id: null },
    status: 'sent',
  });

  // Message sending
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = uuidv4();
    const tempMessage = {
      id: tempId,
      content: newMessage,
      sender: { id: user.id, name: user.name },
      room: selectedRoom.id,
      status: 'sending',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const response = await api.sendMessage({
        content: newMessage,
        sender: user.id,
        room: selectedRoom.id
      });
      console.log('Response:', response);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempId
            ? {
              ...msg,
              ...response,
              status: 'sent',
              // sender: { id: user.id, name: user.name }, // Ensure sender is correctly set
            }
            : msg
        )
      );
    } catch (error) {
      setMessages(prev => prev.map(msg =>
        msg.id === tempId ? {
          ...msg,
          status: 'failed',
          // sender: { name: user.name, id: user.id },
        } : msg
      ));
    }
  };

  // Retry failed messages
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

  if (!selectedRoom?.id) {
    return <div>Please select a valid room to start chatting.</div>;
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-surface-50 dark:bg-surface-900">
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
      <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-surface-0 dark:bg-surface-800 rounded-xl shadow-sm">
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
                  ? 'ml-auto bg-primary-500 text-white'
                  : 'mr-auto bg-surface-100 dark:bg-surface-700'
                  }`}
              >
                {msg.sender?.id !== user.id && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: getSenderColor(msg.sender?.name) }}
                  >
                    {msg.sender?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}

                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    {msg.sender?.id !== user.id && (
                      <strong className="text-sm font-semibold">
                        {msg.sender?.name || 'Unknown'}
                      </strong>
                    )}
                    <span className="text-xs opacity-75">
                      {msg.timestamp && formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </span>
                  </div>

                  <div
                    className="message-content text-sm break-words"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }}
                  />

                  <div className="flex items-center gap-2 mt-1">
                    {msg.status === 'sending' && (
                      <i className="pi pi-spin pi-spinner text-xs text-yellow-500" />
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