import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../backendURL';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        const response = await fetch(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        // Registration
        const response = await fetch(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Registration successful! Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: ''
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="card shadow-lg border-0">
      <div className="card-body p-4 p-md-5">
        {/* Logo and Title */}
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
               style={{width: '64px', height: '64px'}}>
            <ChatBubbleLeftRightIcon className="h-4 w-4 text-primary" />
          </div>
          <h1 className="display-5 fw-bold text-dark mb-2">
            Welcome to ChatApp
          </h1>
          <p className="lead text-muted">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Toggle Button */}
        <div className="text-center mb-4">
          <button
            type="button"
            className="btn btn-link text-decoration-none"
            onClick={toggleMode}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="firstName" className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username *</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              minLength={6}
            />
            {!isLogin && (
              <div className="form-text">Password must be at least 6 characters long</div>
            )}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="passwordConfirmation" className="form-label">Confirm Password *</label>
              <input
                type="password"
                className="form-control"
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleInputChange}
                required={!isLogin}
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Features */}
        <div className="mt-4">
          <div className="d-flex align-items-center text-muted mb-3">
            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                 style={{width: '20px', height: '20px'}}>
              <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="small">Secure user authentication</span>
          </div>
          <div className="d-flex align-items-center text-muted mb-3">
            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                 style={{width: '20px', height: '20px'}}>
              <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="small">Real-time messaging</span>
          </div>
          <div className="d-flex align-items-center text-muted mb-3">
            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                 style={{width: '20px', height: '20px'}}>
              <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="small">User discovery and management</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-muted">
            By using this service, you agree to our Terms of Service and Privacy Policy
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
