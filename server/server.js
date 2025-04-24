const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});