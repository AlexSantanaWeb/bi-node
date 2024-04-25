// Importar modulo ws
const WebSocket = require('ws');

// Definir la clase SalaChatServer
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

// Crear un nuevo servidor websocket en el puerto 9000
const wss = new SalaChatServer({ port: 3000 });

console.log('Servidor WebSocket iniciado en el puerto 3000');

// Evento que se dispara cuando el servidor recibe un mensaje del cliente
wss.on('connection', function connection(ws) {
    console.log('Cliente conectado');

    // Evento que se dispara cuando el servidor recibe un mensaje del cliente
    ws.on('message', function incoming(message) {
        // Convertir el buffer recibido a una cadena de texto
        const messageString = message.toString();
        console.log('Mensaje recibido:', messageString);
    });

    // Evento que se dispara cuando se cierra la conexión con el cliente
    ws.on('close', function close() {
        console.log('Cliente desconectado');
    });
});