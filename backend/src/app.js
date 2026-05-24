const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const aiRoutes = require('./routes/aiRoutes');
const judge0Routes = require('./routes/judge0Routes');
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const antiCheatRoutes = require('./routes/antiCheatRoutes');
const problemRoutes = require('./routes/problemRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Interview Backend is running' });
});

// Mount Routes
app.use('/api', aiRoutes);
app.use('/api', judge0Routes);
app.use('/api/problems', problemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/anti-cheat', antiCheatRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
