const db = require('./db');

// Insertar usuarios
db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['user1', 'user1@example.com', 'password123', 'USER']);
db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['admin1', 'admin1@example.com', 'password123', 'ADMIN']);

// Obtener los IDs de los usuarios insertados
db.query('SELECT id FROM users WHERE username = ?', ['user1'], (err, results) => {
  const userId1 = results[0].id;
  db.query('SELECT id FROM users WHERE username = ?', ['admin1'], (err, results) => {
    const userId2 = results[0].id;

    // Insertar restaurantes
    const restaurants = [
      {
        name: 'Restaurante 1',
        description: 'Descripción del Restaurante 1',
        address: 'Calle 1, 2, 3',
        phone: '912345678',
        user_id: userId1
      },
      {
        name: 'Restaurante 2',
        description: 'Descripción del Restaurante 2',
        address: 'Calle 2, 3, 4',
        phone: '923456789',
        user_id: userId1
      },
      {
        name: 'Restaurante 3',
        description: 'Descripción del Restaurante 3',
        address: 'Calle 3, 4, 5',
        phone: '934567890',
        user_id: userId2
      },
      // ...
    ];

    restaurants.forEach((restaurant) => {
      db.query('INSERT INTO restaurants (name, description, address, phone, user_id) VALUES (?, ?, ?, ?, ?)', [
        restaurant.name,
        restaurant.description,
        restaurant.address,
        restaurant.phone,
        restaurant.user_id
      ]);
    });
  });
});