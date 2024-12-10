const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ordersRoute = require('./routes/orders');

// Import routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product'); // Product routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase') // Removed deprecated options
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Serve index.html on /login
app.get('/login', (req, res) => { 
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'order.html'));
});

app.use('/users', userRoutes);      // Use user routes
app.use('/products', productRoutes); // Use product routes
app.use('/uploads', express.static('uploads')); // For images
app.use('/api/orders', ordersRoute); // Orders API

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});