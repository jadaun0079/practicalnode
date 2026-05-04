const express = require('express');
const app = express();
require('dotenv').config();
require('./config/db');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API running...');
});

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

module.exports = app;