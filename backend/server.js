const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

//Inicializo express
const app = express();
//Creamos el server HTTP antes que Socket.io
const server = http.createServer(app);
//Declaramos el puerto
const PORT = process.env.PORT || 5000;

//Configuración de Socket.io 
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

//Middlewares globales
app.use(cors());
app.use(express.json());

//Middleware de Socket.io (va acá y no aparte porque es una inyección simple)
app.use((req, res, next) => {
    req.io = io;
    next();
});

//Rutas
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

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

/*app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});*/

server.listen(PORT, () => {
    console.log(`El servidor corre en ${PORT}`);
})

io.on("connection", (socket) => {
    console.log('Bienvenido usuario', socket.id);

    socket.on("disconnect", () => {
        console.log('Usuario desconectado', socket.id);
    });
});

module.exports = { app, server };