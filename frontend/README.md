# ChatApp Frontend

A modern React-based chat application frontend with Google Sign-In integration, real-time messaging, and a beautiful UI built with Tailwind CSS.

## Features

- 🚀 **Modern React 18** with hooks and functional components
- 🔐 **Google OAuth Integration** for secure authentication
- 💬 **Real-time Chat Interface** with typing indicators
- 👥 **User Management** and discovery
- 🎨 **Beautiful UI** built with Tailwind CSS
- 📱 **Responsive Design** for all devices
- 🔄 **Protected Routes** with authentication guards
- 📁 **Organized Structure** with layouts, pages, and components

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Main navigation bar
│   ├── Sidebar.jsx     # Chat sidebar with conversations/users
│   └── ChatWindow.jsx  # Main chat interface
├── layouts/            # Layout components
│   ├── MainLayout.jsx  # Main app layout with nav/sidebar
│   └── AuthLayout.jsx  # Authentication pages layout
├── pages/              # Page components
│   ├── HomePage.jsx    # Welcome/home page
│   ├── ChatPage.jsx    # Chat interface page
│   ├── UsersPage.jsx   # User discovery page
│   └── LoginPage.jsx   # Google Sign-In page
├── backendURL.js       # Backend API configuration
├── App.jsx            # Main app component with routing
├── index.js           # App entry point
└── index.css          # Global styles and Tailwind imports
```

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Fetch API** - HTTP requests to backend

## Prerequisites

- Node.js 16+ and npm
- Backend server running on port 5055
- Google OAuth credentials configured

## Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Configuration

### Backend URL

The backend URL is configured in `src/backendURL.js`. Make sure it matches your backend server:

```javascript
export const BACKEND_URL = 'http://localhost:5055';
```

### Google OAuth

Ensure your backend has Google OAuth properly configured with the correct redirect URIs.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Development

### Adding New Components

1. Create component in `src/components/`
2. Import and use in pages or other components
3. Follow the existing naming conventions

### Adding New Pages

1. Create page in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation if needed

### Styling

- Use Tailwind CSS utility classes
- Custom styles go in `src/index.css`
- Follow the existing design system

## Features in Detail

### Authentication
- Google OAuth integration
- Protected routes
- User session management
- Automatic redirect to login

### Chat Interface
- Real-time messaging
- Typing indicators
- Message timestamps
- File attachment support (UI ready)

### User Management
- User discovery
- Profile pictures
- Online status
- Search functionality

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface

## API Integration

The frontend communicates with the backend through these endpoints:

- `GET /auth/profile` - Get current user
- `GET /api/users` - Get all users
- `GET /auth/google` - Google OAuth
- `GET /auth/logout` - User logout

## Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service

3. **Update backend URL** in production build if needed

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Check if backend is running on port 5055
   - Verify CORS settings in backend

2. **Google OAuth Issues**
   - Ensure redirect URIs are correct
   - Check Google Cloud Console settings

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility

### Development Tips

- Use browser dev tools for debugging
- Check console for API errors
- Verify network requests in Network tab
- Test on different screen sizes

## Contributing

1. Follow the existing code structure
2. Use consistent naming conventions
3. Add proper error handling
4. Test on multiple devices
5. Update documentation as needed

## License

This project is part of the ChatApp application.

---

**Happy Coding! 🚀**
