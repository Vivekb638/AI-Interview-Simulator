const logger = require('../utils/logger');

/**
 * A simple in-memory store for WebRTC signaling data.
 * In a production multi-node environment, use Redis.
 */
class WebRTCSignalingService {
  constructor() {
    this.rooms = new Map(); // roomId -> Set of socketIds
    this.offers = new Map(); // roomId -> { senderId, offer }
  }

  joinRoom(roomId, socketId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(socketId);
    logger.debug(`Socket ${socketId} joined WebRTC room ${roomId}`);
  }

  leaveRoom(roomId, socketId) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(socketId);
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
        this.offers.delete(roomId); // cleanup
      }
    }
  }

  storeOffer(roomId, socketId, offer) {
    this.offers.set(roomId, { senderId: socketId, offer });
  }

  getOffer(roomId) {
    return this.offers.get(roomId);
  }
}

module.exports = new WebRTCSignalingService();
