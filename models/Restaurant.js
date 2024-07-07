const db = require('../db');

class Restaurant {
    constructor(name, description, address, phone, userId) {
        this.name = name;
        this.description = description;
        this.address = address;
        this.phone = phone;
        this.user_id = userId;
    }

    static async findAll() {
        const query = 'SELECT * FROM restaurants';
        try {
            const results = await db.execute(query);
            return results[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async findById(id) {
        const query = 'SELECT * FROM restaurants WHERE id =?';
        try {
            const results = await db.execute(query, [id]);
            if (results[0] && results[0].length > 0) {
                const restaurantData = results[0][0];
                return restaurantData;
            } else {
                throw new Error('Restaurant not found');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async create(restaurant) {
        const query = 'INSERT INTO restaurants (name, description, address, phone, user_id) VALUES (?, ?, ?, ?, ?)';
        try {
            const result = await db.execute(query, [
                restaurant.name,
                restaurant.description,
                restaurant.address,
                restaurant.phone,
                restaurant.user_id
            ]);
            const createdRestaurant = { id: result.insertId, ...restaurant };
            return createdRestaurant;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async update(id, updates) {
        const query = 'UPDATE restaurants SET name = ?, address = ?, phone = ? WHERE id = ?';
        try {
            const result = await db.execute(query, [updates.name, updates.address, updates.phone, id]);
            return result.affectedRows;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    static async delete(name) {
        const query = 'DELETE FROM restaurants WHERE name =?';
        try {
            const result = await db.execute(query, [name]);
            return result.affectedRows;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = Restaurant;