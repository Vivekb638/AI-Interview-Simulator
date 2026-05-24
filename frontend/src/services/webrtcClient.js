import socketClient from './socketClient';

class WebRTCClient {
  constructor() {
    this.peerConnections = {}; // Map of targetId -> RTCPeerConnection
    this.localStream = null;
    this.onTrackCallback = null;
  }

  // Set the local media stream (camera/mic or screen)
  setLocalStream(stream) {
    this.localStream = stream;
  }

  // Register callback for when remote tracks are received
  onTrack(callback) {
    this.onTrackCallback = callback;
  }

  // Create a new RTCPeerConnection
  createPeerConnection(targetId, isInitiator) {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers here for production
      ]
    };

    const pc = new RTCPeerConnection(configuration);

    // Add local tracks to the connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketClient.emitToWebRTC('ice-candidate', {
          targetId,
          candidate: event.candidate
        });
      }
    };

    // Handle incoming remote tracks
    pc.ontrack = (event) => {
      if (this.onTrackCallback) {
        this.onTrackCallback(targetId, event.streams[0]);
      }
    };

    this.peerConnections[targetId] = pc;
    return pc;
  }

  async createOffer(targetId) {
    const pc = this.createPeerConnection(targetId, true);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    socketClient.emitToWebRTC('sdp-offer', {
      targetId,
      offer
    });
  }

  async handleOffer(targetId, offer) {
    const pc = this.createPeerConnection(targetId, false);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socketClient.emitToWebRTC('sdp-answer', {
      targetId,
      answer
    });
  }

  async handleAnswer(targetId, answer) {
    const pc = this.peerConnections[targetId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async handleIceCandidate(targetId, candidate) {
    const pc = this.peerConnections[targetId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  closeConnection(targetId) {
    if (this.peerConnections[targetId]) {
      this.peerConnections[targetId].close();
      delete this.peerConnections[targetId];
    }
  }

  closeAll() {
    Object.keys(this.peerConnections).forEach(id => this.closeConnection(id));
  }
}

export default new WebRTCClient();
