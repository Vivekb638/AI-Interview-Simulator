const { validatePayload, joinRoomSchema } = require('../validators/socketValidators');

module.exports = (io) => {
  const sessionNsp = io.of('/session');

  sessionNsp.on('connection', (socket) => {
    console.log(`User connected to /session: ${socket.id}`);

    socket.on('join-session', (payload) => {
      try {
        const { roomId, userId, role } = validatePayload(joinRoomSchema, payload);
        socket.join(roomId);
        socket.userId = userId;
        socket.roomId = roomId;
        socket.role = role;
        console.log(`User ${userId} (${role}) joined session room ${roomId}`);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('interview-started', () => {
      if (socket.roomId && socket.role === 'Recruiter') {
        sessionNsp.to(socket.roomId).emit('interview-started', { timestamp: new Date().toISOString() });
      }
    });

    socket.on('assessment-started', () => {
      if (socket.roomId && socket.role === 'Recruiter') {
        sessionNsp.to(socket.roomId).emit('assessment-started', { timestamp: new Date().toISOString() });
      }
    });

    socket.on('timer-sync', (timeRemaining) => {
      if (socket.roomId && socket.role === 'Recruiter') {
        sessionNsp.to(socket.roomId).emit('timer-sync', timeRemaining);
      }
    });

    socket.on('candidate-warning', (warningMessage) => {
      if (socket.roomId && socket.role === 'Recruiter') {
        sessionNsp.to(socket.roomId).emit('candidate-warning', warningMessage);
      }
    });

    socket.on('recruiter-force-remove', (reason) => {
      if (socket.roomId && socket.role === 'Recruiter') {
        sessionNsp.to(socket.roomId).emit('recruiter-force-remove', reason);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from /session: ${socket.id}`);
    });
  });
};
