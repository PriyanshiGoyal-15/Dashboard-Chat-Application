
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const adminModule = require('./routes/admin');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

app.use(express.json());
app.use(cors({ origin: '*' }));

// connect DB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-chat');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminModule.router);

// socket setup
const io = new Server(server, {
  cors: { origin: '*' }
});

// initialize admin module with io so routes can emit stats
adminModule.init(io);

// map of userId -> socketId for private messaging
const onlineUsers = new Map();

// map of socketId -> username for group chat
const groupUsers = new Map();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  /*** PRIVATE MESSAGING (admin module) ***/
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log('User registered on socket:', userId);
  });

  socket.on('private_message', async ({ to, content, from }) => {
    try {
      const msg = new Message({ from, to, content });
      await msg.save();

      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit('private_message', { from, content, _id: msg._id, createdAt: msg.createdAt });
      }

      // ack to sender
      socket.emit('private_message_sent', { to, content, _id: msg._id, createdAt: msg.createdAt });

      // update recent chats
      io.emit('recent_chat_update', { from, to });

      // emit admin stats update
      try { await adminModule.emitStats(); } catch (e) { console.error('emitStats err', e); }

    } catch (err) {
      console.error(err.message);
    }
  });

  /*** GROUP CHAT (for normal users) ***/
  socket.on('join', (username) => {
    groupUsers.set(socket.id, username);
    io.emit('online_users', Array.from(groupUsers.values()));
  });

  socket.on('send_message', ({ username, message }) => {
    const msg = { username, message, status: 'delivered', createdAt: new Date() };
    io.emit('receive_message', msg);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('user_typing', username);
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('stop_typing');
  });

  socket.on('message_seen', () => {
    socket.broadcast.emit('message_seen');
  });

  /*** DISCONNECT ***/
  socket.on('disconnect', () => {
    if (socket.userId) onlineUsers.delete(socket.userId);
    if (groupUsers.has(socket.id)) groupUsers.delete(socket.id);
    io.emit('online_users', Array.from(groupUsers.values()));
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
