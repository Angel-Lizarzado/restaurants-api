const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const logMiddleware = require('./routes/logMiddleware');
const db = require("./db")

app.use(logMiddleware);
app.use(bodyParser.json());



app.use('/restaurants', require('./routes/restaurants'));
app.use('/users', require('./routes/users'));

const port = 3333;
app.listen(port, () => console.log(`Server is running on port ${port}`));