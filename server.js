// Main server.js file
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const app = express();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middlewares/errorHandler');
const setupSwagger = require('./swagger/swagger');
const cors = require('cors');

// Load env variables
require('dotenv').config();

// Load DB and Passport config
require('./config/db')(); // Connect to MongoDB
require('./config/passport'); // GitHub OAuth setup


// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
//app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);



// Swagger Documentation
require('./swagger/swagger')(app);

// Error Handling
app.use(errorHandler);

// Root
app.get('/', (req, res) => {
  res.send('Project-Supermarket (CRUD Operations)');
});
setupSwagger(app); // Swagger setup
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${process.env.BASE_URL}`);
});


