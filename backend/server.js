const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/products', require('./routes/products'));


app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
//Manejo de errores
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});
app.use((err, req, res, next) => {
    console.error('Internal server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server };