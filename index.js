// index.js

// les modules necessaires
const { Server } = require("socket.io");
const express = require('express');
const http = require('http');

//configuration du web server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// fc pour retard du socket
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//fc pour 
async function emitMessage(socket, initialValue, delayMs, eventEmitName, fluctuationRange) {
  let data = initialValue;
  while (socket.connected) {
    let up = Math.round(Math.random());
    if (up) {
      data += Math.random() * fluctuationRange;
      up = false;
    } else {
      data -= Math.random() * fluctuationRange;
      up = true;
    }
    if (data < 0) {
      data = initialValue;
    }
    socket.emit(eventEmitName, data.toFixed(2));
    await delay(delayMs);
  }
}

//root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//connection event
io.on('connection', (socket) => {
  emitMessage(socket, 10.00, 1500, "socketevent1", 10);
});

//start server
server.listen(process.env.PORT || 8070, () => {
  console.log('listening on *:8070');
});