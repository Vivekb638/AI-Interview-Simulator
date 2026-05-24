require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketManager = require('./sockets');

const server = http.createServer(app);

// Initialize Socket.io
socketManager.init(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
