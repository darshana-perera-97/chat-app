import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon, 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  FunnelIcon,
  PlusIcon,
  HeartIcon,
  UserPlusIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../backendURL';
import { getUserData } from '../utils/localStorage';

const ContactsPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    loadCurrentUser();
    fetchUsers();
    loadFavoritesAndContacts();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, filterStatus, sortBy]);

  const loadCurrentUser = () => {
    const userData = getUserData();
    setCurrentUser(userData);
  };

  const loadFavoritesAndContacts = () => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('chatAppFavorites') || '[]');
    setFavorites(savedFavorites);
    
    // Load contacts from localStorage
    const savedContacts = JSON.parse(localStorage.getItem('chatAppContacts') || '[]');
    setContacts(savedContacts);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USERS, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const usersWithStatus = (data.users || []).map(user => ({
          ...user,
          isOnline: Math.random() > 0.3, // Simulate online status
          lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Simulate last seen
        }));
        setUsers(usersWithStatus);
      } else {
        // Fallback to mock data if API fails
        setUsers(generateMockUsers());
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to mock data
      setUsers(generateMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const generateMockUsers = () => {
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        picture: null,
        createdAt: '2024-01-15T10:00:00Z',
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        picture: null,
        createdAt: '2024-01-20T14:30:00Z',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        picture: null,
        createdAt: '2024-02-01T09:15:00Z',
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        picture: null,
        createdAt: '2024-02-10T16:45:00Z',
        isOnline: false,
        lastSeen: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david.brown@example.com',
        picture: null,
        createdAt: '2024-02-15T11:20:00Z',
        isOnline: true,
        lastSeen: new Date().toISOString()
      }
    ];
    return mockUsers;
  };

  const filterAndSortUsers = () => {
    let filtered = users.filter(user => {
      // Filter out current user
      if (currentUser && user.id === currentUser.id) return false;
      
      // Search filter
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'online' && user.isOnline) ||
        (filterStatus === 'offline' && !user.isOnline);
      
      return matchesSearch && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'recent':
          return new Date(b.lastSeen) - new Date(a.lastSeen);
        case 'joined':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleStartChat = (userId) => {
    // Navigate to chat or open chat modal
    console.log('Starting chat with user:', userId);
    // You can implement navigation to chat here
  };

  const toggleFavorite = (userId) => {
    const newFavorites = favorites.includes(userId)
      ? favorites.filter(id => id !== userId)
      : [...favorites, userId];
    
    setFavorites(newFavorites);
    localStorage.setItem('chatAppFavorites', JSON.stringify(newFavorites));
  };

  const addToContacts = (userId) => {
    if (!contacts.includes(userId)) {
      const newContacts = [...contacts, userId];
      setContacts(newContacts);
      localStorage.setItem('chatAppContacts', JSON.stringify(newContacts));
    }
  };

  const removeFromContacts = (userId) => {
    const newContacts = contacts.filter(id => id !== userId);
    setContacts(newContacts);
    localStorage.setItem('chatAppContacts', JSON.stringify(newContacts));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const formatLastSeen = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100 p-0">
      {/* Header */}
      <div className="bg-white border-bottom p-3" style={{ borderColor: '#e9edef' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0 fw-bold" style={{ color: '#00a884' }}>Contacts</h1>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">
              {filteredUsers.length} users found
            </span>
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* Search and Filters */}
        <div className="row mb-4">
          <div className="col-lg-6 mb-3">
            <div className="position-relative">
              <MagnifyingGlassIcon className="h-4 w-4 position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-lg-3 mb-3">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          
          <div className="col-lg-3 mb-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="recent">Sort by Recent</option>
              <option value="joined">Sort by Joined</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className="row">
          {filteredUsers.map((user) => (
            <div key={user.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100" style={{ transition: 'all 0.2s ease' }}>
                <div className="card-body p-4">
                  {/* User Header */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="position-relative me-3">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="rounded-circle"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            backgroundColor: '#f8f9fa',
                            border: '2px solid #e9edef'
                          }}
                        >
                          <UserCircleIcon className="h-8 w-8 text-muted" />
                        </div>
                      )}
                      <div 
                        className={`position-absolute bottom-0 end-0 rounded-circle border border-white`}
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: user.isOnline ? '#28a745' : '#6c757d'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-bold text-truncate">{user.name || 'Unknown User'}</h6>
                      <p className="mb-0 small text-muted text-truncate">{user.email}</p>
                    </div>
                    
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button 
                            className="dropdown-item"
                            onClick={() => addToContacts(user.id)}
                          >
                            <UserPlusIcon className="h-4 w-4 me-2" />
                            Add to Contacts
                          </button>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item"
                            onClick={() => toggleFavorite(user.id)}
                          >
                            <HeartIcon className="h-4 w-4 me-2" />
                            {favorites.includes(user.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <EnvelopeIcon className="h-4 w-4 me-2 text-muted" />
                      <small className="text-muted">{user.email}</small>
                    </div>
                    
                    <div className="d-flex align-items-center mb-2">
                      <CalendarIcon className="h-4 w-4 me-2 text-muted" />
                      <small className="text-muted">Joined {formatDate(user.createdAt)}</small>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <div 
                        className={`rounded-circle me-2`}
                        style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: user.isOnline ? '#28a745' : '#6c757d'
                        }}
                      ></div>
                      <small className="text-muted">
                        {user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
                      </small>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm flex-fill"
                      onClick={() => handleStartChat(user.id)}
                    >
                      <ChatBubbleLeftRightIcon className="h-4 w-4 me-1" />
                      Chat
                    </button>
                    
                    {contacts.includes(user.id) ? (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromContacts(user.id)}
                        title="Remove from contacts"
                      >
                        <UserPlusIcon className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => addToContacts(user.id)}
                        title="Add to contacts"
                      >
                        <UserPlusIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      className={`btn btn-sm ${favorites.includes(user.id) ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => toggleFavorite(user.id)}
                      title={favorites.includes(user.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <HeartIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-5">
            <UserCircleIcon className="h-16 w-16 text-muted mx-auto mb-3" />
            <h5 className="text-muted mb-2">
              {searchTerm ? 'No users found' : 'No users available'}
            </h5>
            <p className="text-muted mb-0">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'There are currently no users registered in the system'
              }
            </p>
          </div>
        )}
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .card-body {
            padding: 1rem !important;
          }
          
          .col-lg-4 {
            margin-bottom: 1rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .container-fluid {
            padding: 0.5rem !important;
          }
          
          .card-body {
            padding: 0.75rem !important;
          }
          
          .btn {
            font-size: 0.875rem !important;
          }
        }
        
        .card {
          transition: all 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #00a884;
          box-shadow: 0 0 0 0.2rem rgba(0, 168, 132, 0.25);
        }
        
        .btn-primary {
          background-color: #00a884;
          border-color: #00a884;
        }
        
        .btn-primary:hover {
          background-color: #008f6f;
          border-color: #008f6f;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .dropdown-item:active {
          background-color: #00a884;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ContactsPage;
