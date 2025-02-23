import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let users = [];

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join', (username) => {
    users.push({ id: socket.id, username });
    io.emit('users', users);
    socket.broadcast.emit('message', {
      username: 'System',
      message: `${username} joined the chat`,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('sendMessage', (data) => {
    io.emit('message', {
      username: data.username,
      message: data.message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      users = users.filter(u => u.id !== socket.id);
      io.emit('users', users);
      socket.broadcast.emit('message', {
        username: 'System',
        message: `${user.username} left the chat`,
        time: new Date().toLocaleTimeString()
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});