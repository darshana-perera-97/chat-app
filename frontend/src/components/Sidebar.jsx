import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserGroupIcon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      name: 'Home',
      icon: HomeIcon,
      path: '/'
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: ChatBubbleLeftRightIcon,
      path: '/chat'
    },
    {
      id: 'posts',
      name: 'Posts',
      icon: DocumentTextIcon,
      path: '/posts'
    },
    {
      id: 'contacts',
      name: 'Contacts',
      icon: UserGroupIcon,
      path: '/contacts'
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: UserCircleIcon,
      path: '/profile'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close sidebar on mobile when item is clicked
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
             <div className={`bg-white border-end border-2 ${className}`} 
     style={{width: '220px', minHeight: '100vh', borderColor: '#e9edef'}}>
      
             {/* Mobile Header */}
       <div className="d-flex d-lg-none align-items-center justify-content-between p-3 border-bottom" style={{borderColor: '#e9edef'}}>
         <h6 className="mb-0 fw-bold" style={{color: '#00a884'}}>Navigation</h6>
                   <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={onClose}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
       </div>

       {/* Desktop Header */}
       <div className="d-none d-lg-block p-3 border-bottom" style={{borderColor: '#e9edef'}}>
         <h6 className="mb-0 fw-bold" style={{color: '#00a884'}}>Navigation</h6>
       </div>

                                       {/* Navigation Items */}
              <nav className="p-3 sidebar-nav">
                <ul className="nav nav-pills flex-column gap-1">
                 {navigationItems.map((item) => {
                   const Icon = item.icon;
                   const isActive = isActiveRoute(item.path);
                   
                   return (
                     <li key={item.id} className="nav-item">
                                                                        <button
                          onClick={() => handleNavigation(item.path)}
                          className={`nav-link w-100 text-start d-flex align-items-center p-2 ${
                            isActive ? 'active' : ''
                          }`}
                          type="button"
                          title={item.name}
                        >
                          <Icon className="h-3 w-3 me-2" />
                          <span className="fw-medium">{item.name}</span>
                        </button>
                     </li>
                   );
                 })}
               </ul>
             </nav>

             {/* Footer Section */}
       <div className="mt-auto p-3 border-top" style={{borderColor: '#e9edef'}}>
         <div className="text-center">
           <small style={{color: '#667781'}}>
             ChatApp v1.0
           </small>
         </div>
       </div>
    </div>
  );
};

export default Sidebar;
