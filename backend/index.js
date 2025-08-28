const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World!',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Hello World API: http://localhost:${PORT}/`);
});

module.exports = app;
