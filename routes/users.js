const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /usuarios
router.post('/', async (req, res) => {
    try {
        const restaurant = new Restaurant(
            req.body.name,
            req.body.description,
            req.body.address,
            req.body.phone,
            req.body.userid
        );
        const id = await Restaurant.create(restaurant);
        res.json({ id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating restaurant' });
    }
});

// POST /usuarios/login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByUsername(req.body.username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const isValid = user.comparePassword(req.body.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ _id: user.id, role: user.role }, 'y_secret_key_1234567890', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;