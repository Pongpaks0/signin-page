const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');
const User = require('./models/User');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const bytes = CryptoJS.AES.decrypt(user.password, 'your-secret-key');
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (password !== decryptedPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
