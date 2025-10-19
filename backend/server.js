const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));