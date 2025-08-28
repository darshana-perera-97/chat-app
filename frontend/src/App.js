import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BACKEND_URL, API_ENDPOINTS } from './backendURL';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';

// Components
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PROFILE, {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else if (response.status === 401) {
        // User is not authenticated - this is normal, not an error
        console.log('User not authenticated - showing login page');
        setUser(null);
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
      <Router>
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
      </Router>
    );
  }

  return (
    <Router>
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
              <Navigate to="/" replace />
            ) : (
              <AuthLayout>
                {console.log('Rendering LoginPage route')}
                <LoginPage />
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

          <Route path="/users" element={
            user ? (
              <MainLayout>
                <UsersPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Catch all route - redirect to login if not authenticated */}
          <Route path="*" element={
            user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
