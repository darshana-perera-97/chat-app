require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5055;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create users.json if it doesn't exist
const usersFile = path.join(dataDir, 'users.json');
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
}

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// User authentication middleware
const authenticateUser = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World!',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: '/auth/register',
      login: '/auth/login',
      logout: '/auth/logout',
      profile: '/auth/profile',
      users: '/api/users'
    }
  });
});

// User registration
app.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, username, password, passwordConfirmation, email } = req.body;
    
    // Validation
    if (!firstName || !lastName || !username || !password || !passwordConfirmation || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Read existing users
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    
    // Check if username or email already exists
    if (usersData.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    if (usersData.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Add to users array
    usersData.push(newUser);
    
    // Save to file
    fs.writeFileSync(usersFile, JSON.stringify(usersData, null, 2));
    
    // Create session (auto-login after registration)
    req.session.userId = newUser.id;
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Read existing users
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    
    // Find user by username or email
    const user = usersData.find(u => u.username === username || u.email === username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Save updated data
    const updatedUsers = usersData.map(u => 
      u.id === user.id ? user : u
    );
    fs.writeFileSync(usersFile, JSON.stringify(updatedUsers, null, 2));
    
    // Create session
    req.session.userId = user.id;
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get user profile
app.get('/auth/profile', authenticateUser, (req, res) => {
  try {
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const user = usersData.find(u => u.id === req.session.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'User profile',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// API to get all users
app.get('/api/users', authenticateUser, (req, res) => {
  try {
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    
    // Return users without passwords
    const usersWithoutPasswords = usersData.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      message: 'Users retrieved successfully',
      count: usersWithoutPasswords.length,
      users: usersWithoutPasswords
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read users data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Hello World API: http://localhost:${PORT}/`);
  console.log(`🔐 User Registration: http://localhost:${PORT}/auth/register`);
  console.log(`🔐 User Login: http://localhost:${PORT}/auth/login`);
  console.log(`📁 Data stored in: ${dataDir}`);
});

module.exports = app;
