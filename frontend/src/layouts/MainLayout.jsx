import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="d-flex">
        {/* Left Sidebar Navigation */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
          className={`sidebar-responsive ${sidebarOpen ? 'show' : ''}`}
        />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay show d-lg-none" 
            onClick={closeSidebar}
          ></div>
        )}
        
        {/* Main content area */}
        <main className="flex-grow-1 p-3 p-md-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
