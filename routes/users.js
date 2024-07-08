const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');
const logMiddleware = require('./logMiddleware');

// POST /users
router.post('/', logMiddleware, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const user = new User(username, email, password, role);
        await user.save();
        res.json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

// POST /login
router.post('/login', logMiddleware, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = await generateToken(user);
        res.json({ token: token.token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /users/restaurantes
router.get('/restaurantes', authenticate, logMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const restaurants = await Restaurant.findAllForUsers(userId);
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching restaurants' });
    }
});

// función para generar un token de acceso
const generateToken = async (user) => {
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
    };
    const SECRET_KEY = 'secret_key_1234567890';
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1h',
    });
    return { token, message: 'Login successful' };
};

module.exports = router;