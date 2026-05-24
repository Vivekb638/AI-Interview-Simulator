const { validatePayload, joinRoomSchema, chatMessageSchema } = require('../validators/socketValidators');

module.exports = (io) => {
  const chatNsp = io.of('/chat');

  chatNsp.on('connection', (socket) => {
    console.log(`User connected to /chat: ${socket.id}`);

    socket.on('join-room', (payload) => {
      try {
        const { roomId, userId } = validatePayload(joinRoomSchema, payload);
        socket.join(roomId);
        socket.userId = userId;
        console.log(`User ${userId} joined chat room ${roomId}`);
        socket.to(roomId).emit('user-online', { userId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-offline', { userId: socket.userId });
    });

    socket.on('send-message', (payload) => {
      try {
        const data = validatePayload(chatMessageSchema, payload);
        // Emitting to the room
        chatNsp.to(data.roomId).emit('receive-message', data);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('typing', { userId: socket.userId });
    });

    socket.on('stop-typing', (roomId) => {
      socket.to(roomId).emit('stop-typing', { userId: socket.userId });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from /chat: ${socket.id}`);
    });
  });
};
