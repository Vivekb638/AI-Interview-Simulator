const { validatePayload, joinRoomSchema, cheatingEventSchema } = require('../validators/socketValidators');

module.exports = (io) => {
  const monitoringNsp = io.of('/monitoring');

  monitoringNsp.on('connection', (socket) => {
    console.log(`User connected to /monitoring: ${socket.id}`);

    socket.on('join-monitoring-room', (payload) => {
      try {
        const { roomId, userId } = validatePayload(joinRoomSchema, payload);
        socket.join(roomId);
        socket.userId = userId;
        socket.roomId = roomId;
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('cheating_event', (payload) => {
      try {
        // Validate payload structure
        const data = validatePayload(cheatingEventSchema, payload);
        
        // Emitting the validated data back to the room so recruiter sees it
        if (socket.roomId) {
          monitoringNsp.to(socket.roomId).emit('cheating-alert', {
            candidateId: socket.userId,
            ...data
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from /monitoring: ${socket.id}`);
    });
  });
};
