import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  ClockIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { getUserData, storeUserData } from '../utils/localStorage';
import { API_ENDPOINTS } from '../backendURL';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    chats: 0,
    contacts: 0,
    memberSince: null
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserData = () => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
      setEditForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        email: userData.email || ''
      });
    }
    setLoading(false);
  };

  const loadUserStats = () => {
    if (!user) return;
    
    // Load posts count from localStorage
    const posts = JSON.parse(localStorage.getItem('chatAppPosts') || '[]');
    const userPosts = posts.filter(post => 
      post.author === user.username || 
      (post.author === `${user.firstName} ${user.lastName}`.trim())
    );
    
    // Load contacts count (if available)
    const contacts = JSON.parse(localStorage.getItem('chatAppContacts') || '[]');
    
    setStats({
      posts: userPosts.length,
      chats: 0, // This would come from backend in a real app
      contacts: contacts.length,
      memberSince: user.createdAt || user.lastLogin || new Date().toISOString()
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || ''
      });
      setError(null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Update user data locally first
      const updatedUser = {
        ...user,
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        lastUpdated: new Date().toISOString()
      };

      // Store updated data
      storeUserData(updatedUser);
      setUser(updatedUser);
      
      // In a real app, you would also update the backend
      // const response = await fetch(API_ENDPOINTS.PROFILE, {
      //   method: 'PUT',
      //   credentials: 'include',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
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
          <p className="text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-muted mb-3" />
          <h5 className="text-muted">No user data found</h5>
          <p className="text-muted mb-0">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100 p-0">
      {/* Header */}
      <div className="bg-white border-bottom p-3" style={{ borderColor: '#e9edef' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0 fw-bold" style={{ color: '#00a884' }}>Profile</h1>
          <button 
            className={`btn ${isEditing ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <XMarkIcon className="h-4 w-4 me-2" />
                Cancel
              </>
            ) : (
              <>
                <PencilIcon className="h-4 w-4 me-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Success/Error Messages */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
            <CheckIcon className="h-4 w-4 me-2" />
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            <XMarkIcon className="h-4 w-4 me-2" />
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="row">
          {/* Profile Information */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  <UserIcon className="h-5 w-5 me-2 text-primary" />
                  Personal Information
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        maxLength="50"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        maxLength="50"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={editForm.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        maxLength="30"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        maxLength="100"
                      />
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-primary me-2"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Saving...</span>
                            </div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4 me-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">First Name</label>
                      <p className="mb-0 fw-medium">{user.firstName || 'Not set'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Last Name</label>
                      <p className="mb-0 fw-medium">{user.lastName || 'Not set'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Username</label>
                      <p className="mb-0 fw-medium">{user.username || 'Not set'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Email</label>
                      <p className="mb-0 fw-medium">{user.email || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  <ShieldCheckIcon className="h-5 w-5 me-2 text-success" />
                  Account Statistics
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <DocumentTextIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{stats.posts}</h6>
                    <small className="text-muted">Posts Created</small>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{stats.chats}</h6>
                    <small className="text-muted">Active Chats</small>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                    <UserGroupIcon className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{stats.contacts}</h6>
                    <small className="text-muted">Contacts</small>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <CalendarIcon className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{formatDate(stats.memberSince)}</h6>
                    <small className="text-muted">Member Since</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  <ShieldCheckIcon className="h-5 w-5 me-2 text-info" />
                  Account Details
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">User ID</label>
                    <p className="mb-0 fw-medium font-monospace">{user.id}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Account Status</label>
                    <p className="mb-0">
                      <span className="badge bg-success">Active</span>
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Last Login</label>
                    <p className="mb-0 fw-medium">
                      {user.lastLogin ? formatTimeAgo(user.lastLogin) : 'Unknown'}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Last Updated</label>
                    <p className="mb-0 fw-medium">
                      {user.lastUpdated ? formatTimeAgo(user.lastUpdated) : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .card-body {
            padding: 1rem !important;
          }
          
          .card-header {
            padding: 0.75rem !important;
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
            width: 100%;
            margin-bottom: 0.5rem;
          }
        }
        
        .card {
          transition: all 0.2s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        
        .form-control:focus {
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
      `}</style>
    </div>
  );
};

export default ProfilePage;
