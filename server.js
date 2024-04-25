const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Crear una instancia de la aplicación Express
const app = express();

// Crear un servidor HTTP utilizando Express
const server = http.createServer(app);

// Importar el módulo ws y definir la clase SalaChatServer
class SalaChatServer extends WebSocket.Server {
    constructor(options) {
        super(options);
        this.on('connection', this.connected);
    }

    connected(ws) {
        console.log('user connected');

        ws.on('message', (message) => {
            console.log('user sent:', message);
            this.broadcast(message, ws);
        });

        ws.on('close', () => {
            console.log('user disconnected');
        });
    }

    broadcast(message, sender) {
        this.clients.forEach(function each(client) {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}

// Crear un servidor WebSocket utilizando el servidor HTTP
const wss = new SalaChatServer({ server });

// Agregar middleware para configurar las cabeceras CORS
app.use(function (req, res, next) {
    // Permitir acceso desde cualquier origen
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Permitir los encabezados de solicitud que incluyen la solicitud del cliente
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Permitir los métodos de solicitud GET, POST y OPTIONS
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// Manejar la conexión WebSocket
wss.on('connection', function connection(ws) {
    console.log('Cliente conectado');

    // Escuchar los mensajes del cliente
    ws.on('message', function incoming(message) {
        // Convertir el buffer recibido a una cadena de texto
        const messageString = message.toString();
        console.log('Mensaje recibido:', messageString);
    });

    // Escuchar el cierre de la conexión
    ws.on('close', function close() {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor HTTP en el puerto 3000
server.listen(3000, function () {
    console.log('Servidor WebSocket iniciado en el puerto 3000');
});