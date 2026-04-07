const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0'; // 绑定到所有接口，允许外部访问

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/models', require('./routes/models'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/imagegen', require('./routes/imagegen'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/dimensions', require('./routes/dimensions'));
app.use('/api/history', require('./routes/history'));
app.use('/api/favorite', require('./routes/favorite'));
app.use('/api/points', require('./routes/points'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/codingplan', require('./routes/codingplan'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.3',
    uptime: process.uptime()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
