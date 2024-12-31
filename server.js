require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');  // Import the db.js file
const { generateToken, verifyToken } = require('./config/jwt');  // Import the jwt.js file
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
//const { authenticateToken } = require('../middleware/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/devices', deviceRoutes);

// Connect to MongoDB
connectDB();  // Use the connectDB function to connect to MongoDB

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
