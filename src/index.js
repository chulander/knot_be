const http = require('http');
const socketIo = require('socket.io');
const app = require('./app'); // Import the app from app.js

const server = http.createServer(app);
const process = require('process');
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const io = socketIo(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (user_id) => {
    socket.join(`user_${user_id}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('socketio', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
