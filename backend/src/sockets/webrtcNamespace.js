const { validatePayload, joinRoomSchema, webrtcSignalSchema } = require('../validators/socketValidators');

module.exports = (io) => {
  const webrtcNsp = io.of('/webrtc-signal');

  webrtcNsp.on('connection', (socket) => {
    console.log(`User connected to /webrtc-signal: ${socket.id}`);

    socket.on('join-webrtc-room', (payload) => {
      try {
        const { roomId, userId } = validatePayload(joinRoomSchema, payload);
        socket.join(roomId);
        socket.userId = userId;
        socket.roomId = roomId;
        
        socket.to(roomId).emit('participant-joined', { userId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('sdp-offer', (payload) => {
      try {
        const { targetId, signalData } = validatePayload(webrtcSignalSchema, payload);
        socket.to(targetId).emit('sdp-offer', { senderId: socket.userId, offer: signalData });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('sdp-answer', (payload) => {
      try {
        const { targetId, signalData } = validatePayload(webrtcSignalSchema, payload);
        socket.to(targetId).emit('sdp-answer', { senderId: socket.userId, answer: signalData });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('ice-candidate', (payload) => {
      try {
        const { targetId, signalData } = validatePayload(webrtcSignalSchema, payload);
        socket.to(targetId).emit('ice-candidate', { senderId: socket.userId, candidate: signalData });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('start-screen-share', (roomId) => {
      socket.to(roomId).emit('start-screen-share', { userId: socket.userId });
    });

    socket.on('stop-screen-share', (roomId) => {
      socket.to(roomId).emit('stop-screen-share', { userId: socket.userId });
    });

    socket.on('camera-toggle', (payload) => {
      socket.to(socket.roomId).emit('camera-toggle', { userId: socket.userId, enabled: payload.enabled });
    });

    socket.on('mic-toggle', (payload) => {
      socket.to(socket.roomId).emit('mic-toggle', { userId: socket.userId, enabled: payload.enabled });
    });

    socket.on('connection-state-change', (payload) => {
      socket.to(socket.roomId).emit('connection-state-change', { userId: socket.userId, state: payload.state });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from /webrtc-signal: ${socket.id}`);
      if (socket.roomId && socket.userId) {
        socket.to(socket.roomId).emit('participant-left', { userId: socket.userId });
      }
    });
  });
};
