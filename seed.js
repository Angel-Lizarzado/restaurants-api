const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

mongoose.connect('mongodb://localhost/restaurants', { useNewUrlParser: true, useUnifiedTopology: true });

const users = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        birthdate: new Date('1990-01-01'),
        gender: 'male',
    },
    {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        role: 'user',
        birthdate: new Date('1995-06-15'),
        gender: 'female',
    },
    {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
        role: 'user',
        birthdate: new Date('1980-03-20'),
        gender: 'male',
    },
];

const restaurants = [
    {
        name: 'Restaurant 1',
        description: 'Description of Restaurant 1',
        address: 'Address 1',
        phone: '123-456-7890',
        user: users[0]._id,
    },
    {
        name: 'Restaurant 2',
        description: 'Description of Restaurant 2',
        address: 'Address 2',
        phone: '987-654-3210',
        user: users[1]._id,
    },
    {
        name: 'Restaurant 3',
        description: 'Description of Restaurant 3',
        address: 'Address 3',
        phone: '555-123-4567',
        user: users[2]._id,
    },
];

async function seed() {
    try {
        // Eliminamos los datos existentes
        await User.deleteMany({});
        await Restaurant.deleteMany({});

        // Creamos los usuarios
        const createdUsers = await User.create(users);

        // Creamos los restaurantes
        await Restaurant.create(restaurants);

        console.log('Datos de prueba creados con éxito!');
    } catch (error) {
        console.error('Error al crear datos de prueba:', error);
    } finally {
        mongoose.disconnect();
    }
}

seed();