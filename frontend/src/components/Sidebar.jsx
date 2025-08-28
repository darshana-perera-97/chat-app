import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS } from '../backendURL';
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('conversations');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (activeTab === 'conversations') {
      fetchConversations();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Mock conversations for now - in real app, fetch from chat endpoint
        setConversations([
          {
            id: '1',
            name: 'John Doe',
            lastMessage: 'Hey, how are you?',
            timestamp: '2 min ago',
            unreadCount: 2
          },
          {
            id: '2',
            name: 'Jane Smith',
            lastMessage: 'See you tomorrow!',
            timestamp: '1 hour ago',
            unreadCount: 0
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleNewConversation = () => {
    navigate('/new-conversation');
    onClose(); // Close sidebar on mobile
  };

  const handleItemClick = () => {
    onClose(); // Close sidebar on mobile when item is clicked
  };

  return (
    <div className={`bg-white border-end border-2 border-light ${className}`} 
         style={{width: '320px', minHeight: '100vh'}}>
      
      {/* Mobile Header */}
      <div className="d-flex d-lg-none align-items-center justify-content-between p-3 border-bottom">
        <h6 className="mb-0 fw-bold">Menu</h6>
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs nav-fill border-0" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'conversations' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversations')}
            type="button"
            role="tab"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 me-2" />
            <span className="d-none d-sm-inline">Conversations</span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            type="button"
            role="tab"
          >
            <UserGroupIcon className="h-5 w-5 me-2" />
            <span className="d-none d-sm-inline">Users</span>
          </button>
        </li>
      </ul>

      {/* Content */}
      <div className="flex-grow-1 overflow-auto" style={{height: 'calc(100vh - 120px)'}}>
        {activeTab === 'conversations' ? (
          <div>
            {/* New Conversation Button */}
            <div className="p-3 border-bottom">
              <button
                onClick={handleNewConversation}
                className="btn btn-primary w-100"
              >
                <PlusIcon className="h-5 w-5 me-2" />
                New Conversation
              </button>
            </div>

            {/* Conversations List */}
            <div className="list-group list-group-flush">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="list-group-item list-group-item-action border-0 px-3 py-3 cursor-pointer"
                  onClick={() => {
                    navigate(`/chat/${conversation.id}`);
                    handleItemClick();
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                      <h6 className="mb-1 fw-semibold text-truncate">
                        {conversation.name}
                      </h6>
                      <p className="mb-1 text-muted small text-truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <small className="text-muted mb-1">
                        {conversation.timestamp}
                      </small>
                      {conversation.unreadCount > 0 && (
                        <span className="badge bg-primary rounded-pill">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {users.map((user) => (
              <div
                key={user.id}
                className="list-group-item list-group-item-action border-0 px-3 py-3 cursor-pointer"
                onClick={() => {
                  navigate(`/chat/new?user=${user.id}`);
                  handleItemClick();
                }}
              >
                <div className="d-flex align-items-center">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="rounded-circle me-3"
                      style={{width: '40px', height: '40px'}}
                    />
                  ) : (
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3"
                         style={{width: '40px', height: '40px'}}>
                      <span className="text-white fw-bold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold text-truncate">
                      {user.name || 'Unknown User'}
                    </h6>
                    <p className="mb-0 text-muted small text-truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
