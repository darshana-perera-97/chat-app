import React, { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS } from '../backendURL';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GROUP_CHAT, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        setError('Failed to load messages');
      }
    } catch (error) {
      setError('Network error while loading messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.GROUP_CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: newMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.chatMessage]);
        setNewMessage('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Network error while sending message');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(timeString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Simulate typing indicator
    if (value.trim()) {
      setIsTyping(true);
      // Clear typing indicator after 2 seconds of no typing
      setTimeout(() => setIsTyping(false), 2000);
    } else {
      setIsTyping(false);
    }
  };

  return (
    <div className="container-fluid h-100 d-flex flex-column">
      <div className="row flex-grow-1">
        <div className="col-12 d-flex flex-column h-100">
          {/* Chat Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded shadow-sm">
            <h4 className="mb-0" style={{color: '#00a884'}}>
              <i className="bi bi-people-fill me-2"></i>
              Group Chat
            </h4>
            <small className="text-muted">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </small>
          </div>

          {/* Messages Container */}
          <div className="flex-grow-1 bg-white rounded shadow-sm mb-0" style={{minHeight: '400px', maxHeight: '600px'}}>
            <div className="p-3 h-100 overflow-auto">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-chat-dots display-4"></i>
                  <p className="mt-3">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="d-flex align-items-start gap-3 chat-message">
                      {/* User Avatar */}
                      <div 
                        className="user-avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          fontSize: '14px'
                        }}
                      >
                        {getInitials(msg.senderName)}
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-bold" style={{color: '#111b21'}}>
                            {msg.senderName}
                          </span>
                          <small className="text-muted">
                            {formatTime(msg.timestamp)}
                          </small>
                        </div>
                        <div className="message-bubble">
                          <p className="mb-1" style={{color: '#111b21'}}>{msg.message}</p>
                        </div>
                        <div className="message-status">
                          <small className="text-muted">
                            {formatDate(msg.timestamp)}
                          </small>
                          <span className="message-delivered ms-2">
                            <i className="bi bi-check2-all text-primary"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="d-flex align-items-start gap-3 chat-message">
                      <div 
                        className="user-avatar"
                        style={{
                          width: '40px',
                          height: '40px',
                          fontSize: '14px'
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div>
                      <div className="typing-indicator">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <small className="text-muted">You are typing...</small>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

                     {/* Message Input - WhatsApp Style */}
           <div className="chat-input-container">
             <div className="chat-input-wrapper">
               <div className="chat-input-group">
                 <div className="chat-input-field">
                   <input
                     type="text"
                     className="chat-input"
                     placeholder="Type a message"
                     value={newMessage}
                     onChange={handleMessageChange}
                     disabled={loading}
                     onKeyPress={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         if (newMessage.trim() && !loading) {
                           sendMessage(e);
                         }
                       }
                     }}
                   />
                   <div className="chat-input-actions">
                     <button
                       type="button"
                       className="chat-action-btn"
                       title="Emoji"
                     >
                       <i className="bi bi-emoji-smile"></i>
                     </button>
                     <button
                       type="button"
                       className="chat-action-btn"
                       title="Attach file"
                     >
                       <i className="bi bi-paperclip"></i>
                     </button>
                     <button
                       type="button"
                       className="chat-action-btn"
                       title="Voice message"
                     >
                       <i className="bi bi-mic"></i>
                     </button>
                   </div>
                 </div>
                 <button
                   type="button"
                   className="chat-send-button"
                   onClick={sendMessage}
                   disabled={loading || !newMessage.trim()}
                 >
                   {loading ? (
                     <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                   ) : (
                     <i className="bi bi-send-fill"></i>
                   )}
                 </button>
               </div>
               
               {/* Character Counter */}
               {newMessage.length > 0 && (
                 <div className="chat-input-footer">
                   <small className="text-muted">
                     {newMessage.length} character{newMessage.length !== 1 ? 's' : ''}
                   </small>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
