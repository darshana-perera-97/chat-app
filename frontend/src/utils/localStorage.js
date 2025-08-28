// Local Storage Utility Functions for ChatApp

const USER_STORAGE_KEY = 'chatAppUser';

/**
 * Store user data in local storage
 * @param {Object} userData - User object to store
 */
export const storeUserData = (userData) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    console.log('✅ User data stored in local storage:', {
      id: userData.id,
      username: userData.username,
      name: `${userData.firstName} ${userData.lastName}`,
      timestamp: new Date().toLocaleString()
    });
  } catch (error) {
    console.error('❌ Failed to store user data in local storage:', error);
  }
};

/**
 * Retrieve user data from local storage
 * @returns {Object|null} User object or null if not found/invalid
 */
export const getUserData = () => {
  try {
    const storedData = localStorage.getItem(USER_STORAGE_KEY);
    if (storedData) {
      const userData = JSON.parse(storedData);
      console.log('📱 User data retrieved from local storage:', {
        id: userData.id,
        username: userData.username,
        name: `${userData.firstName} ${userData.lastName}`
      });
      return userData;
    }
  } catch (error) {
    console.error('❌ Failed to retrieve user data from local storage:', error);
    // Clear corrupted data
    clearUserData();
  }
  return null;
};

/**
 * Clear user data from local storage
 */
export const clearUserData = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    console.log('🗑️ User data cleared from local storage');
  } catch (error) {
    console.error('❌ Failed to clear user data from local storage:', error);
  }
};

/**
 * Check if user data exists in local storage
 * @returns {boolean} True if user data exists
 */
export const hasUserData = () => {
  return getUserData() !== null;
};

/**
 * Get user ID from local storage
 * @returns {string|null} User ID or null if not found
 */
export const getUserId = () => {
  const userData = getUserData();
  return userData ? userData.id : null;
};

/**
 * Get user display name from local storage
 * @returns {string|null} User's full name or null if not found
 */
export const getUserDisplayName = () => {
  const userData = getUserData();
  if (userData && userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`;
  }
  return userData ? userData.username : null;
};
