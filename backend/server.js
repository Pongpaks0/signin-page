const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const User = require('./models/Users');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGODB_URI)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'], // Add other HTTP methods as needed
}));


app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'email already exists' });
        }

        const newUser = new User({ email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const decryptedBytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET_KEY);
        const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (password === decryptedPassword) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/check-alive', async (req, res) => {
    res.status(200).json({ message: 'Yes' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});