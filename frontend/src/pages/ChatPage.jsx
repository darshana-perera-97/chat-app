import React, { useState, useEffect, useRef } from "react";
import { API_ENDPOINTS } from "../backendURL";
import { getUserData } from "../utils/localStorage";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current user data on component mount
  useEffect(() => {
    const user = getUserData();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();

    // Add demo messages for testing if no messages exist
    if (messages.length === 0) {
      const demoMessages = [
        {
          id: 1,
          message: "Hey everyone! Welcome to the group chat! 👋",
          senderId: "user2",
          senderName: "John Doe",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        },
        {
          id: 2,
          message:
            "Hi John! Thanks for setting this up. How is everyone doing?",
          senderId: "user3",
          senderName: "Jane Smith",
          timestamp: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
        },
        {
          id: 3,
          message:
            "I'm doing great! Working on some new features for our project.",
          senderId: "user4",
          senderName: "Mike Johnson",
          timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        },
        {
          id: 4,
          message:
            "That sounds exciting! Can't wait to see what you've been working on.",
          senderId: "user5",
          senderName: "Sarah Wilson",
          timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        },
      ];

      // Set demo messages after a short delay to simulate loading
      setTimeout(() => {
        setMessages(demoMessages);
      }, 1000);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GROUP_CHAT, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setError("");
      } else if (response.status === 404) {
        // API endpoint not found - this is normal for development
        console.log("Group chat API not implemented yet - using local storage");
        loadMessagesFromLocalStorage();
        setError("");
      } else {
        console.log("Backend error:", response.status);
        // Fallback to local storage if backend fails
        loadMessagesFromLocalStorage();
        setError("");
      }
    } catch (error) {
      console.log("Network error - using local storage fallback:", error);
      // Fallback to local storage if network fails
      loadMessagesFromLocalStorage();
      setError("");
    } finally {
      setLoading(false);
    }
  };

  // Load messages from localStorage as fallback
  const loadMessagesFromLocalStorage = () => {
    try {
      const storedMessages = JSON.parse(localStorage.getItem('chatAppMessages') || '[]');
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      setMessages([]);
    }
  };

  // Save messages to localStorage
  const saveMessagesToLocalStorage = (messages) => {
    try {
      localStorage.setItem('chatAppMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setLoading(true);
    setError("");

    // Create new message object
    const newMsg = {
      id: Date.now(),
      message: newMessage.trim(),
      senderId: currentUser?.id || currentUser?.username || "currentUser",
      senderName: currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : "You",
      timestamp: new Date().toISOString(),
    };

    // Add message locally first for immediate display
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    
    // Save to localStorage
    saveMessagesToLocalStorage([...messages, newMsg]);

    // Try to send to backend (optional)
    try {
      const response = await fetch(API_ENDPOINTS.GROUP_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          message: newMsg.message,
          senderId: newMsg.senderId,
          senderName: newMsg.senderName 
        }),
      });

      if (!response.ok) {
        console.log("Backend not available - message saved locally");
      }
    } catch (error) {
      console.log("Network error - message saved locally:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(timeString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return "Today";
      } else if (diffDays === 2) {
        return "Yesterday";
      } else if (diffDays <= 7) {
        return date.toLocaleDateString([], { weekday: "long" });
      } else {
        return date.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
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

  const isCurrentUserMessage = (message) => {
    if (!currentUser) return false;
    return (
      message.senderId === currentUser.id ||
      message.senderId === currentUser.username ||
      message.senderId === "currentUser"
    );
  };

  return (
    <div className="container-fluid h-100 d-flex flex-column">

      
      <div className="row flex-grow-1">
        <div className="col-12 d-flex flex-column h-100">
          {/* Chat Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-white rounded shadow-sm">
            <h4 className="mb-0" style={{ color: "#00a884" }}>
              <i className="bi bi-people-fill me-2"></i>
              Group Chat
            </h4>
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </small>
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-1">
                  <div
                    className="bg-success rounded-circle"
                    style={{ width: "8px", height: "8px" }}
                  ></div>
                  <small className="text-muted">Online</small>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className="flex-grow-1 bg-white rounded shadow-sm mb-0"
            style={{ minHeight: "400px", maxHeight: "600px" }}
          >
            <div className="p-3 h-100 overflow-auto">
              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-chat-dots display-4"></i>
                  <p className="mt-3">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {messages.map((msg) => {
                    const isCurrentUser = isCurrentUserMessage(msg);
                    return (
                      <div
                        key={msg.id}
                        className={`d-flex align-items-start gap-3 chat-message ${
                          isCurrentUser
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        {/* User Avatar - Only show for other users' messages */}
                        {!isCurrentUser && (
                          <div
                            className="user-avatar flex-shrink-0"
                            style={{
                              width: "40px",
                              height: "40px",
                              fontSize: "14px",
                              backgroundColor: "#00a884",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(msg.senderName)}
                          </div>
                        )}

                        {/* Message Content */}
                        <div
                          className={`flex-grow-1 ${
                            isCurrentUser ? "text-end" : ""
                          }`}
                          style={{ maxWidth: "70%" }}
                        >
                          {/* Sender Name - Only show for other users' messages */}
                          {!isCurrentUser && (
                            <div className="mb-1">
                              <span
                                className="fw-bold"
                                style={{ color: "#111b21", fontSize: "0.9rem" }}
                              >
                                {msg.senderName}
                              </span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`message-bubble d-inline-block p-3 rounded-3 mb-1 ${
                              isCurrentUser
                                ? "bg-primary text-white"
                                : "bg-light text-dark"
                            }`}
                            style={{
                              maxWidth: "100%",
                              wordWrap: "break-word",
                              borderRadius: isCurrentUser
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px",
                            }}
                          >
                            <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                              {msg.message}
                            </p>
                          </div>

                          {/* Message Meta - Time and Date */}
                          <div
                            className={`d-flex align-items-center gap-2 ${
                              isCurrentUser
                                ? "justify-content-end"
                                : "justify-content-start"
                            }`}
                          >
                            <small
                              className={`text-muted ${
                                isCurrentUser ? "text-white-50" : ""
                              }`}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {formatTime(msg.timestamp)}
                            </small>
                            <small
                              className={`text-muted ${
                                isCurrentUser ? "text-white-50" : ""
                              }`}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {formatDate(msg.timestamp)}
                            </small>
                            {isCurrentUser && (
                              <span className="message-delivered ms-1">
                                <i
                                  className="bi bi-check2-all text-white-50"
                                  style={{ fontSize: "0.75rem" }}
                                ></i>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* User Avatar - Only show for current user's messages */}
                        {isCurrentUser && (
                          <div
                            className="user-avatar flex-shrink-0"
                            style={{
                              width: "40px",
                              height: "40px",
                              fontSize: "14px",
                              backgroundColor: "#007bff",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(
                              currentUser.firstName + " " + currentUser.lastName
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="d-flex align-items-start gap-3 chat-message justify-content-start">
                      <div
                        className="user-avatar flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "14px",
                          backgroundColor: "#00a884",
                          color: "white",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div>
                      <div className="typing-indicator">
                        <div className="typing-dots d-flex gap-1 mb-1">
                          <span
                            className="bg-secondary rounded-circle"
                            style={{
                              width: "6px",
                              height: "6px",
                              animation: "bounce 1.4s infinite ease-in-out",
                            }}
                          ></span>
                          <span
                            className="bg-secondary rounded-circle"
                            style={{
                              width: "6px",
                              height: "6px",
                              animation:
                                "bounce 1.4s infinite ease-in-out 0.2s",
                            }}
                          ></span>
                          <span
                            className="bg-secondary rounded-circle"
                            style={{
                              width: "6px",
                              height: "6px",
                              animation:
                                "bounce 1.4s infinite ease-in-out 0.4s",
                            }}
                          ></span>
                        </div>
                        <small className="text-muted">
                          Someone is typing...
                        </small>
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
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleMessageChange}
                    disabled={loading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
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
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className="bi bi-send-fill"></i>
                  )}
                </button>
              </div>

              {/* Character Counter */}
              {newMessage.length > 0 && (
                <div className="chat-input-footer">
                  <small className="text-muted">
                    {newMessage.length} character
                    {newMessage.length !== 1 ? "s" : ""}
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
