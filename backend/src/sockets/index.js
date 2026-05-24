const { Server } = require('socket.io');

const chatNamespace = require('./chatNamespace');
const sessionNamespace = require('./sessionNamespace');
const webrtcNamespace = require('./webrtcNamespace');
const monitoringNamespace = require('./monitoringNamespace');

let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
      },
    });

    chatNamespace(io);
    sessionNamespace(io);
    webrtcNamespace(io);
    monitoringNamespace(io);

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
