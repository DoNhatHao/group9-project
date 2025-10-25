const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
app.use(express.json());

// MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://user123:<db_password>@cluster09.fsauk2d.mongodb.net/?appName=Cluster09';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// GET all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new user
app.post('/api/users', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));