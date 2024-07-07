const db = require('../db');
const bcrypt = require('bcryptjs');

class User {
    constructor(username, email, password, role, gender) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.gender = gender;
    }

    encryptPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username =?';
        const result = await db.query(query, username);
        return result[0];
    }

    static async create(user) {
        user.password = user.encryptPassword(user.password);
        const query = 'INSERT INTO users SET?';
        const result = await db.query(query, user);
        return result.insertId;
    }
}

module.exports = User;