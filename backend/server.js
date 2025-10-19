const express = require('express');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');
const { initDB } = require('./models/database');

const app = express();
const PORT = 8081;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(session({
  name: 'ihwp-session',
  secret: 'ihwp-secret-key-for-session',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Initialize database
initDB();

// Session logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Session ID: ${req.sessionID}, User ID: ${req.session.userId}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/forum', forumRoutes);
console.log('Forum routes registered at /api/forum');

// Basic routes for other endpoints (return empty for now)
app.get('/api/recommendations/*', (req, res) => res.json({}));
app.get('/api/recipes/*', (req, res) => res.json({}));
app.get('/api/progress/*', (req, res) => res.json({}));

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});