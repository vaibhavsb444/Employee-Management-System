const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --------------------------------------------------------------------------
// Middleware
// --------------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// Serve static frontend files directly from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// --------------------------------------------------------------------------
// Routes
// --------------------------------------------------------------------------
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1
      ? 'connected'
      : mongoose.connection.readyState === 2
      ? 'connecting'
      : 'disconnected';

  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Fallback to frontend index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// --------------------------------------------------------------------------
// Database Connection & Server Start
// --------------------------------------------------------------------------
async function startServer() {
  if (!MONGODB_URI || MONGODB_URI === 'YOUR_MONGODB_ATLAS_CONNECTION_STRING') {
    console.warn('\n=============================================================');
    console.warn('⚠️  MONGODB_URI is not configured yet in backend/.env');
    console.warn('   Please paste your MongoDB Atlas connection string in backend/.env:');
    console.warn('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.../dbname');
    console.warn('=============================================================\n');
  } else {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Successfully connected to MongoDB Atlas database!');
    } catch (err) {
      console.error('❌ MongoDB Atlas connection error:', err.message);
      console.warn('   Please check your database user credentials, IP whitelist, and network connection.');
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Employee Management Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at: http://localhost:${PORT}/api/employees`);
    console.log(`🌐 Frontend accessible at: http://localhost:${PORT}\n`);
  });
}

startServer();
