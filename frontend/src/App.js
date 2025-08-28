import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { BACKEND_URL, API_ENDPOINTS } from './backendURL';
import { storeUserData, getUserData, clearUserData } from './utils/localStorage';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';
import PostsPage from './pages/PostsPage';

// Components
import Navbar from './components/Navbar';

// Inner component that can use useNavigate hook
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
    
    // Set up periodic validation of stored user data
    const validationInterval = setInterval(() => {
      if (user) {
        validateStoredUserData();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    // Listen for storage events (when user logs out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'chatAppUser' && e.newValue === null) {
        console.log('User logged out in another tab, clearing local state...');
        setUser(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(validationInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  // Debug user state changes
  useEffect(() => {
    console.log('User state changed:', user);
    console.log('Current URL:', window.location.pathname);
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking auth status...');
      
      // First, check if we have user data in local storage
      const storedUser = getUserData();
      if (storedUser && validateStoredUser(storedUser)) {
        console.log('Found valid user in local storage:', storedUser);
        setUser(storedUser);
        setLoading(false);
        return;
      }
      
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        credentials: 'include'
      });
      console.log('Auth check response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User authenticated:', userData.user);
        
        // Store user data in local storage
        storeUserData(userData.user);
        setUser(userData.user);
      } else if (response.status === 401) {
        // User is not authenticated - this is normal, not an error
        console.log('User not authenticated - showing login page');
        setUser(null);
        
        // Clear any stored user data
        clearUserData();
        
        // If we're on a protected route, redirect to login
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login from protected route:', window.location.pathname);
          navigate('/login');
        }
      } else {
        // Other error status - backend might have issues
        console.log('Backend error:', response.status);
        setBackendError(true);
      }
    } catch (error) {
      // Network error - backend not available
      console.log('Backend not available:', error);
      setBackendError(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh auth status (can be called from LoginPage)
  const refreshAuthStatus = async () => {
    console.log('Manually refreshing auth status...');
    await checkAuthStatus();
  };

  // Function to handle session expiration
  const handleSessionExpiration = () => {
    console.log('Session expired, clearing user data...');
    clearUserData();
    setUser(null);
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  };

  // Function to validate stored user data
  const validateStoredUser = (storedUser) => {
    // Check if stored user has required fields
    if (!storedUser || !storedUser.id || !storedUser.username) {
      console.log('Stored user data is invalid, clearing...');
      clearUserData();
      return false;
    }
    
    // Check if stored data is not too old (optional - you can adjust this)
    const storedTime = storedUser.lastLogin || storedUser.createdAt;
    if (storedTime) {
      const storedDate = new Date(storedTime);
      const now = new Date();
      const daysDiff = (now - storedDate) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 30) { // Clear data older than 30 days
        console.log('Stored user data is too old, clearing...');
        clearUserData();
        return false;
      }
    }
    
    return true;
  };

  // Function to periodically validate stored user data with backend
  const validateStoredUserData = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        credentials: 'include'
      });
      
      if (response.status === 401) {
        console.log('Stored user data is no longer valid, clearing...');
        handleSessionExpiration();
      } else if (response.ok) {
        const userData = await response.json();
        // Update stored data with latest information
        storeUserData(userData.user);
        setUser(userData.user);
      }
    } catch (error) {
      console.log('Failed to validate user data with backend:', error);
      // Don't clear data on network errors, just log
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('App state:', { user, loading, backendError });
  console.log('Current URL:', window.location.pathname);
  console.log('About to render main app with user:', user);

  // If backend is not available, show login page
  if (backendError) {
    return (
      <div className="App">
          <Routes>
            <Route path="*" element={
              <AuthLayout>
                <div className="card shadow-lg border-0">
                  <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                      <h1 className="display-5 fw-bold text-dark mb-3">
                        Backend Not Available
                      </h1>
                      <p className="lead text-muted mb-4">
                        Please make sure your backend server is running on port 5055
                      </p>
                      <div className="alert alert-warning text-start">
                        <h5 className="alert-heading fw-bold">To fix this:</h5>
                        <ol className="mb-0">
                          <li>Navigate to the backend folder</li>
                          <li>Run: <code className="bg-light px-2 py-1 rounded">npm install</code></li>
                          <li>Run: <code className="bg-light px-2 py-1 rounded">npm start</code></li>
                          <li>Make sure the server starts on port 5055</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </AuthLayout>
            } />
          </Routes>
        </div>
      );
    }

  return (
    <div className="App">
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={
            user ? (
              <MainLayout>
                <HomePage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Login Route - Always accessible when not authenticated */}
          <Route path="/login" element={
            user ? (
              <Navigate to="/posts" replace />
            ) : (
              <AuthLayout>
                {console.log('Rendering LoginPage route')}
                <LoginPage onAuthSuccess={refreshAuthStatus} />
              </AuthLayout>
            )
          } />

          <Route path="/chat/*" element={
            user ? (
              <MainLayout>
                <ChatPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="/posts" element={
            user ? (
              <MainLayout>
                <PostsPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="/users" element={
            user ? (
              <MainLayout>
                <UsersPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="/contacts" element={
            user ? (
              <MainLayout>
                <ContactsPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="/profile" element={
            user ? (
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Catch all route - redirect to posts if authenticated, login if not */}
          <Route path="*" element={
            user ? <Navigate to="/posts" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    );
  }

// Main App component that provides Router context
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
