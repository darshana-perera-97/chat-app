import React, { useState, useEffect } from 'react';
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

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    if (firstName && !lastName) return firstName.charAt(0).toUpperCase();
    if (!firstName && lastName) return lastName.charAt(0).toUpperCase();
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const startEdit = () => {
    setIsEditing(true);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || ''
    });
    setError(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || ''
    });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedUser = {
        ...user,
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        lastUpdated: new Date().toISOString()
      };

      storeUserData(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
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
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Success/Error Messages */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Profile Header with Avatar */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 text-center">
                <div className="mb-3">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="rounded-circle"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: '#007bff',
                        color: 'white',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  )}
                </div>
                <h4 className="mb-1 fw-bold">{user.firstName} {user.lastName}</h4>
                <p className="text-muted mb-2">@{user.username}</p>
                <p className="text-muted mb-0">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  Personal Information
                </h5>
              </div>
              <div className="card-body p-4">
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
                    <p className="mb-0 fw-medium">@{user.username || 'Not set'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Email</label>
                    <p className="mb-0 fw-medium">{user.email || 'Not set'}</p>
                  </div>
                  {user.phone && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Phone</label>
                      <p className="mb-0 fw-medium">{user.phone}</p>
                    </div>
                  )}
                  {user.bio && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Bio</label>
                      <p className="mb-0 fw-medium">{user.bio}</p>
                    </div>
                  )}
                  {user.location && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Location</label>
                      <p className="mb-0 fw-medium">{user.location}</p>
                    </div>
                  )}
                  {user.website && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small">Website</label>
                      <p className="mb-0 fw-medium">
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          {user.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  User Statistics
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="text-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                        <span className="text-primary fw-bold fs-4">{stats.totalUsers || 0}</span>
                      </div>
                      <h6 className="mb-1 fw-bold">{stats.totalUsers || 0}</h6>
                      <p className="text-muted small mb-0">Total Users</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                        <span className="text-success fw-bold fs-4">{stats.totalMessages || 0}</span>
                      </div>
                      <h6 className="mb-1 fw-bold">{stats.totalMessages || 0}</h6>
                      <p className="text-muted small mb-0">Total Messages</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="text-center">
                      <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '60px', height: '60px' }}>
                        <span className="text-warning fw-bold fs-4">{stats.totalPosts || 0}</span>
                      </div>
                      <h6 className="mb-1 fw-bold">{stats.totalPosts || 0}</h6>
                      <p className="text-muted small mb-0">Total Posts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  Edit Profile
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={startEdit}>
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive User Data */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3" style={{ borderColor: '#e9edef' }}>
                <h5 className="card-title mb-0 fw-bold">
                  All User Data
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  {Object.entries(user).map(([key, value]) => {
                    // Skip certain fields that are already displayed elsewhere
                    if (['id', 'firstName', 'lastName', 'username', 'email', 'picture'].includes(key)) {
                      return null;
                    }
                    
                    // Format the key for display
                    const displayKey = key
                      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
                      .replace(/([A-Z])/g, ' $1') // Add space before remaining capitals
                      .trim();
                   
                    // Format the value for display
                    let displayValue = value;
                    if (value === null || value === undefined) {
                      displayValue = 'Not set';
                    } else if (typeof value === 'boolean') {
                      displayValue = value ? 'Yes' : 'No';
                    } else if (typeof value === 'object') {
                      displayValue = JSON.stringify(value, null, 2);
                    } else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('time')) {
                      try {
                        displayValue = formatDate(value);
                      } catch {
                        displayValue = value;
                      }
                    }
                    
                    return (
                      <div key={key} className="col-md-6 mb-3">
                        <label className="form-label text-muted small">{displayKey}</label>
                        <p className="mb-0 fw-medium">
                          {typeof displayValue === 'string' && displayValue.startsWith('http') ? (
                            <a href={displayValue} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                              {displayValue}
                            </a>
                          ) : (
                            <span className={displayValue === 'Not set' ? 'text-muted' : ''}>
                              {displayValue}
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {Object.keys(user).length <= 6 && (
                  <div className="text-center text-muted mt-3">
                    <p className="mb-0">No additional user data available</p>
                  </div>
                )}
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
