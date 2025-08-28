# Local Storage Utilities for ChatApp

This directory contains utility functions for managing user data in the browser's local storage.

## Features

- **User Data Persistence** - Store user information locally for faster app loading
- **Automatic Validation** - Check stored data validity and age
- **Cross-Tab Synchronization** - Handle logout events across multiple browser tabs
- **Error Handling** - Graceful fallback when storage operations fail
- **Data Cleanup** - Automatic removal of corrupted or expired data

## Functions

### `storeUserData(userData)`
Stores user data in local storage with error handling.

**Parameters:**
- `userData` (Object) - User object containing id, username, firstName, lastName, etc.

**Example:**
```javascript
import { storeUserData } from './utils/localStorage';

const user = {
  id: '123',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
};

storeUserData(user);
```

### `getUserData()`
Retrieves user data from local storage with validation.

**Returns:**
- `Object|null` - User object if found and valid, null otherwise

**Example:**
```javascript
import { getUserData } from './utils/localStorage';

const user = getUserData();
if (user) {
  console.log('Welcome back,', user.firstName);
}
```

### `clearUserData()`
Removes user data from local storage.

**Example:**
```javascript
import { clearUserData } from './utils/localStorage';

clearUserData(); // Called during logout
```

### `hasUserData()`
Checks if user data exists in local storage.

**Returns:**
- `boolean` - True if user data exists

**Example:**
```javascript
import { hasUserData } from './utils/localStorage';

if (hasUserData()) {
  // User is logged in
}
```

### `getUserId()`
Gets the user ID from stored data.

**Returns:**
- `string|null` - User ID or null if not found

**Example:**
```javascript
import { getUserId } from './utils/localStorage';

const userId = getUserId();
if (userId) {
  // Use userId for API calls
}
```

### `getUserDisplayName()`
Gets the user's display name from stored data.

**Returns:**
- `string|null` - Full name or username, null if not found

**Example:**
```javascript
import { getUserDisplayName } from './utils/localStorage';

const displayName = getUserDisplayName();
console.log('Hello,', displayName);
```

## Storage Key

The user data is stored under the key: `chatAppUser`

## Data Structure

```json
{
  "id": "unique-user-id",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z"
}
```

## Security Features

- **Data Validation** - Checks for required fields and data integrity
- **Age Validation** - Automatically clears data older than 30 days
- **Error Recovery** - Removes corrupted data automatically
- **Cross-Tab Sync** - Handles logout events across browser tabs

## Usage in Components

### App.js
```javascript
import { storeUserData, getUserData, clearUserData } from './utils/localStorage';

// Store user data after login
storeUserData(userData);

// Retrieve user data on app start
const storedUser = getUserData();

// Clear user data on logout
clearUserData();
```

### Navbar.jsx
```javascript
import { clearUserData } from '../utils/localStorage';

const handleLogout = async () => {
  // ... logout API call
  clearUserData(); // Clear local storage
  setUser(null);
  navigate('/login');
};
```

## Browser Compatibility

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Mobile Browsers** - Full support

## Error Handling

All functions include try-catch blocks and will:
- Log errors to console
- Automatically clean up corrupted data
- Provide fallback behavior
- Not crash the application

## Performance Benefits

- **Faster App Loading** - No need to wait for API calls on app start
- **Reduced Server Load** - Fewer authentication requests
- **Better User Experience** - Instant user recognition
- **Offline Capability** - Basic functionality without internet

## Best Practices

1. **Always validate stored data** before using it
2. **Clear data on logout** to prevent security issues
3. **Handle storage errors** gracefully
4. **Use the utility functions** instead of direct localStorage access
5. **Test cross-tab behavior** for logout scenarios
