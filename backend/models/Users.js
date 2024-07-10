const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// Encrypt password before saving
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = CryptoJS.AES.encrypt(this.password, process.env.AES_SECRET_KEY).toString();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
