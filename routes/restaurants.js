const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const authenticate = require('./authenticate');
const logMiddleware = require('./logMiddleware');

// GET /restaurantes
router.get('/', logMiddleware, async (req, res) => {
    try {
        const results = await Restaurant.findAll();
        const restaurantsJson = results.map(restaurant => ({
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            user_id: restaurant.user_id,
        }));
        res.json(restaurantsJson);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching restaurants' });
    }
});

// POST /restaurantes
router.post('/', logMiddleware, authenticate, async (req, res) => {
    const restaurant = {
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        phone: req.body.phone
    };

    try {
        const createdRestaurant = await Restaurant.create(restaurant, req.user.userId);
        res.send(createdRestaurant);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// GET /restaurantes/:id
router.get('/:id', logMiddleware, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json({
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                phone: restaurant.phone,
                user_id: restaurant.user_id,
            });
        }
    } catch (err) {
        if (err.message === 'Restaurant not found') {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.status(500).json({ error: 'Error fetching restaurant' });
        }
    }
});

// PUT /restaurantes/:id
router.put('/:id', logMiddleware, authenticate, async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const userId = req.user.userId;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        if (userId !== restaurant.user_id) {
            return res.status(403).json({ error: 'You are not the owner of this restaurant' });
        }

        const updates = req.body;
        const affectedRows = await Restaurant.update(restaurantId, updates);
        res.json({ message: 'Restaurant updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating restaurant' });
    }
});

// DELETE /restaurantes/:id
router.delete('/:id', logMiddleware, authenticate, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can delete restaurants' });
    }

    try {
        const id = req.params.id;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        const affectedRows = await Restaurant.delete(id);
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json({ message: `Restaurant with ID ${id} deleted successfully` });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error deleting restaurant' });
    }
});

module.exports = router;