const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const PORT = process.env.PORT || 3100;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`otkroyte etu ssilku v browsere:  http://localhost:${PORT}`);
});

app.use(express.static('public'));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});


const uniqueConnections = [];


io.sockets.on('connection', (socket) => {
    console.log("Успешное соединение");


    if (uniqueConnections.indexOf(socket.id) === -1) {
       
        uniqueConnections.push(socket.id);

        
        io.sockets.emit('update users', { count: uniqueConnections.length });
    }

    
    socket.on('disconnect', () => {
     
        const index = uniqueConnections.indexOf(socket.id);
        if (index !== -1) {
            uniqueConnections.splice(index, 1);
            console.log("Отключились");

          
            io.sockets.emit('update users', { count: uniqueConnections.length });
        }
    });

  
    socket.on('send mess', (data) => {

        io.sockets.emit('add mess', { mess: data.mess, name: data.name, className: data.className });
    });
});
