import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-gradient d-flex align-items-center justify-content-center p-3">
      <div className="w-100" style={{maxWidth: '450px'}}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
