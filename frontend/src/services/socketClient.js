import { io } from 'socket.io-client';
import { supabase } from '../lib/supabase';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class SocketClient {
  constructor() {
    this.chatSocket = null;
    this.sessionSocket = null;
    this.webrtcSocket = null;
    this.monitoringSocket = null;
  }

  async getAuthOptions() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      auth: { token: session?.access_token }
    };
  }

  async connectBase() {
    const options = await this.getAuthOptions();
    if (!this.chatSocket) this.chatSocket = io(`${SOCKET_URL}/chat`, options);
    if (!this.sessionSocket) this.sessionSocket = io(`${SOCKET_URL}/session`, options);
  }

  async connectInterview() {
    const options = await this.getAuthOptions();
    if (!this.webrtcSocket) this.webrtcSocket = io(`${SOCKET_URL}/webrtc-signal`, options);
    if (!this.monitoringSocket) this.monitoringSocket = io(`${SOCKET_URL}/monitoring`, options);
  }

  disconnectAll() {
    if (this.chatSocket) { this.chatSocket.disconnect(); this.chatSocket = null; }
    if (this.sessionSocket) { this.sessionSocket.disconnect(); this.sessionSocket = null; }
    if (this.webrtcSocket) { this.webrtcSocket.disconnect(); this.webrtcSocket = null; }
    if (this.monitoringSocket) { this.monitoringSocket.disconnect(); this.monitoringSocket = null; }
  }

  disconnectInterview() {
    if (this.webrtcSocket) { this.webrtcSocket.disconnect(); this.webrtcSocket = null; }
    if (this.monitoringSocket) { this.monitoringSocket.disconnect(); this.monitoringSocket = null; }
  }

  // Helper for emitting to specific namespaces easily
  emitToMonitoring(event, data) {
    if (this.monitoringSocket) this.monitoringSocket.emit(event, data);
  }

  emitToWebRTC(event, data) {
    if (this.webrtcSocket) this.webrtcSocket.emit(event, data);
  }
}

export default new SocketClient();
