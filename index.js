const express = require('express');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/upload');
const statusRoutes = require('./routes/status');
const webhookRoutes = require('./routes/webhook');
const imageProcessorQueue = require('./workers/imageProcessor');

const app = express();

// Connect to Database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', uploadRoutes);
app.use('/api', statusRoutes);
app.use('/api', webhookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize the image processor worker
// imageProcessorQueue.process();

module.exports = app;
