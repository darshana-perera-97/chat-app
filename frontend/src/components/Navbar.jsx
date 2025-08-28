import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL, API_ENDPOINTS } from '../backendURL';
import { clearUserData } from '../utils/localStorage';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
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
      }
    } catch (error) {
      console.log('User not authenticated');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        credentials: 'include'
      });
      
      // Clear user data from local storage
      clearUserData();
      
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if logout fails, clear local storage and redirect
      clearUserData();
      setUser(null);
      navigate('/login');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
         <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom" style={{borderColor: '#e9edef'}}>
      <div className="container-fluid">
        {/* Logo and Mobile Menu Button */}
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-link d-lg-none me-2 p-0"
            onClick={onMenuClick}
            type="button"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
                     <h1 className="navbar-brand mb-0 h1 fw-bold" style={{color: '#00a884'}}>ChatApp</h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="d-none d-md-block flex-grow-1 mx-4">
          <div className="position-relative">
            <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="form-control ps-5"
            />
          </div>
        </div>

        {/* Right side navigation */}
        <div className="navbar-nav ms-auto align-items-center">
          {/* Notifications */}
          <button className="btn btn-link text-muted p-2 me-2">
            <BellIcon className="h-5 w-5" />
          </button>

          {/* User Profile */}
          {user ? (
            <div className="nav-item dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="rounded-circle me-2"
                    style={{width: '32px', height: '32px'}}
                  />
                ) : (
                  <UserCircleIcon className="h-5 w-5 me-2 text-muted" />
                )}
                                 <span className="d-none d-sm-inline text-dark fw-medium">{user.firstName} {user.lastName}</span>
              </button>

              <ul className={`dropdown-menu dropdown-menu-end ${isProfileOpen ? 'show' : ''}`}>
                <li><button className="dropdown-item" onClick={() => navigate('/profile')}>Your Profile</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Sign out</button></li>
              </ul>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="btn btn-primary"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
