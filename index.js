const express = require('express');
const { resolve } = require('path');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const salesRoutes = require('./routes/sales.routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const path = require('path');
const morgon = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3010;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgon());
app.use(express.json());
app.use(express.static('static'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    mongodb: mongoStatus
  });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sales', salesRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});