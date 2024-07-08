const bcrypt = require('bcryptjs');
const db = require('../db');

class User {
    constructor(username, email, password, role) {
        this.username = username;
        this.email = email;
        this.password = password; // <--- Agregar esta línea
        this.hashedPassword = password ? bcrypt.hashSync(password, 10) : null;
        this.role = role;
    }

    async save() {
        if (!this.password) {
            throw new Error('Password is required');
        }
        const hashedPassword = await this.encryptPassword(this.password);
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)';
        const params = [this.username, this.email, hashedPassword, this.role];
        try {
            const result = await db.execute(query, params);
            return { message: 'User saved successfully', userId: result.insertId };
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async encryptPassword(password) {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await bcrypt.compare(password, this.password);
    }

    static async findByUsername(username) {
        if (!username) {
            throw new Error('Username is required');
        }
        try {
            const query = `SELECT * FROM users WHERE username =?`;
            const [rows] = await db.execute(query, [username]);
            if (rows.length === 0) {
                return null;
            }
            const userData = rows[0];
            return new User(userData.username, userData.email, userData.password, userData.role); // Create a new User instance
        } catch (err) {
            throw err;
        }
    }

    static async findIdForUsername(username) {
        if (!username) {
            throw new Error('Username is required');
        }

        const query = `SELECT id FROM users WHERE username =?`;
        const result = await db.execute(query, [username]);
        const id = result[0][0].id;
        return id; // Devuelve el objeto con los datos del usuario

    }
}

module.exports = User;