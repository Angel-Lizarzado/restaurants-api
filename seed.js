const db = require('./db');

const users = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$Q0p5UfJzBZzvhvZzgP/jHe7z1XeoU6zpRjKhWU6nCZWxPVZzrOgKC',
        // password: 'admin'
        role: 'ADMIN'
    },
    {
        username: 'user1',
        email: 'user1@example.com',
        password: '$2a$10$Q0p5UfJzBZzvhvZzgP/jHe7z1XeoU6zpRjKhWU6nCZWxPVZzrOgKC',
        // password: 'user1'
        role: 'USER'
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: '$2a$10$Q0p5UfJzBZzvhvZzgP/jHe7z1XeoU6zpRjKhWU6nCZWxPVZzrOgKC',
        // password: 'user2'
        role: 'USER'
    }
];

const restaurants = [
    {
        name: 'Restaurante 1',
        description: 'Descripcion del restaurante 1',
        address: 'Calle 1, 2, 3',
        phone: '934567895',
        user_id: 1 // assigned to admin
    },
    {
        name: 'Restaurante 2',
        description: 'Descripcion del restaurante 2',
        address: 'Calle 4, 5, 6',
        phone: '934567896',
        user_id: 2 // assigned to user1
    },
    {
        name: 'Restaurante 3',
        description: 'Descripcion del restaurante 3',
        address: 'Calle 7, 8, 9',
        phone: '934567897',
        user_id: 1 // assigned to admin
    },
    {
        name: 'Restaurante 4',
        description: 'Descripcion del restaurante 4',
        address: 'Calle 10, 11, 12',
        phone: '934567898',
        user_id: 3 // assigned to user2
    },
    {
        name: 'Restaurante 5',
        description: 'Descripcion del restaurante 5',
        address: 'Calle 13, 14, 15',
        phone: '934567899',
        user_id: 2 // assigned to user1
    }
];

async function createTables() {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('ADMIN', 'USER') NOT NULL,
      PRIMARY KEY (id)
    );
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INT AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      address VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,  
      user_id INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
}

async function seed() {
    await createTables();

    // Remove foreign key constraint
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');

    await db.execute('TRUNCATE users');
    await db.execute('TRUNCATE restaurants');

    for (const user of users) {
        const hashedPassword = user.password;
        delete user.password;
        await db.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [user.username, user.email, hashedPassword, user.role]);
    }

    for (const restaurant of restaurants) {
        await db.execute('INSERT INTO restaurants (name, description, address, phone, user_id) VALUES (?, ?, ?, ?, ?)', [restaurant.name, restaurant.description, restaurant.address, restaurant.phone, restaurant.user_id]);
    }

    // Restore foreign key constraint
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Seed completed!');
}

seed();