const socketManager = require('../sockets');

exports.emitToChat = (roomId, event, data) => {
  const io = socketManager.getIO();
  io.of('/chat').to(roomId).emit(event, data);
};

exports.emitToSession = (sessionId, event, data) => {
  const io = socketManager.getIO();
  io.of('/session').to(sessionId).emit(event, data);
};

exports.emitCheatingAlert = (roomId, candidateId, alertType, severity) => {
  const io = socketManager.getIO();
  io.of('/monitoring').to(roomId).emit('cheating-alert', {
    candidateId,
    alertType,
    severity,
    serverTimestamp: Date.now()
  });
};
