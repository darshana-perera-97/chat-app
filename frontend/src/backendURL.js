// Backend URL Configuration
export const BACKEND_URL = 'http://localhost:5055';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${BACKEND_URL}/auth/register`,
  LOGIN: `${BACKEND_URL}/auth/login`,
  LOGOUT: `${BACKEND_URL}/auth/logout`,
  PROFILE: `${BACKEND_URL}/auth/profile`,

  // Data
  USERS: `${BACKEND_URL}/api/users`,
  ROOT: `${BACKEND_URL}/`,
  
  // Group Chat
  GROUP_CHAT: `${BACKEND_URL}/api/groupchat`,
};

// WebSocket URL (for future real-time chat)
export const WEBSOCKET_URL = 'ws://localhost:5055';

export default BACKEND_URL;
