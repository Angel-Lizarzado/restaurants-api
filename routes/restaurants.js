const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const authenticate = require('./authenticate');
const logMiddleware = require('./logMiddleware');


// GET /restaurantes
router.get('/', logMiddleware, async (req, res) => {
    try {
        const results = await Restaurant.findAll();
        const restaurants = results; // results is an array of rows
        const restaurantsJson = restaurants.map(restaurant => ({
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            user_id: restaurant.user_id,
        }));
        res.json(restaurantsJson);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching restaurants' });
    }
});
// POST /restaurantes
router.post('/', logMiddleware, async (req, res) => {
    try {
        const { name, description, address, phone, user_id } = req.body;
        const restaurant = new Restaurant(name, description, address, phone, user_id);
        const createdRestaurant = await Restaurant.create(restaurant);
        res.json(createdRestaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating restaurant' });
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
            const restaurantJson = {
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                phone: restaurant.phone,
                user_id: restaurant.user_id,
            };
            res.json(restaurantJson); // Devuelve el objeto serializado
        }
    } catch (err) {
        if (err.message === 'Restaurant not found') {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            console.error(err);
            res.status(500).json({ error: 'Error fetching restaurant' });
        }
    }
});
// PUT /restaurantes/:id
router.put('/:id', logMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const id = req.params.id;
        const updates = req.body;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Verificar permisos
        if (req.user.role === 'USER') {
            // Si es un usuario normal, solo puede editar sus propios restaurantes
            if (req.user.id !== restaurant.user_id) {
                return res.status(403).json({ error: 'You are not the owner of this restaurant' });
            }
        } else if (req.user.role === 'ADMIN') {
            // Si es un administrador, puede editar cualquier restaurante
            // No hay restricciones adicionales
        } else {
            return res.status(403).json({ error: 'Invalid user role' });
        }

        const affectedRows = await Restaurant.update(id, updates);
        res.json({ message: 'Restaurant updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating restaurant' });
    }
});
// DELETE /restaurantes/:id
router.delete('/:id', logMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const id = req.params.id;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Verificar permisos
        if (req.user.role === 'USER') {
            // Si es un usuario normal, solo puede eliminar sus propios restaurantes
            if (req.user.id !== restaurant.user_id) {
                return res.status(403).json({ error: 'Only the owner or admin can delete this restaurant' });
            }
        } else if (req.user.role === 'ADMIN') {
            // Si es un administrador, puede eliminar cualquier restaurante
            // No hay restricciones adicionales
        } else {
            return res.status(403).json({ error: 'Invalid user role' });
        }

        const affectedRows = await Restaurant.delete(id);
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json({ message: 'Restaurant deleted successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting restaurant' });
    }
});


function cleanObject(obj) {
    const newObj = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            newObj[key] = cleanObject(obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

module.exports = router;