import { useEffect, useState, useRef } from 'react';
import socketClient from '../services/socketClient';
import webrtcClient from '../services/webrtcClient';

const useWebRTC = (roomId, isInitiator = false) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const localVideoRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Socket.IO connection for WebRTC
    socketClient.connectAll();
    const socket = socketClient.webrtcSocket;
    socket.emit('join-webrtc-room', roomId);

    // 2. Setup WebRTC Client callbacks
    webrtcClient.onTrack((senderId, stream) => {
      setRemoteStreams(prev => ({ ...prev, [senderId]: stream }));
    });

    // 3. Listen to Socket.IO signaling events
    socket.on('sdp-offer', async ({ senderId, offer }) => {
      await webrtcClient.handleOffer(senderId, offer);
    });

    socket.on('sdp-answer', async ({ senderId, answer }) => {
      await webrtcClient.handleAnswer(senderId, answer);
    });

    socket.on('ice-candidate', async ({ senderId, candidate }) => {
      await webrtcClient.handleIceCandidate(senderId, candidate);
    });

    return () => {
      webrtcClient.closeAll();
      socket.off('sdp-offer');
      socket.off('sdp-answer');
      socket.off('ice-candidate');
    };
  }, [roomId]);

  // Request user media (Camera/Mic)
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      webrtcClient.setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error('Failed to access camera/mic:', err);
    }
  };

  // Screen Sharing (getDisplayMedia)
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      webrtcClient.setLocalStream(stream);
      
      // Notify others via socket
      socketClient.emitToWebRTC('start-screen-share', roomId);

      // Listen for stop event
      stream.getVideoTracks()[0].onended = () => {
        socketClient.emitToWebRTC('stop-screen-share', roomId);
        // Fallback to camera if needed
      };

      return stream;
    } catch (err) {
      console.error('Failed to access screen share:', err);
    }
  };

  // Initiate call
  const callPeer = async (targetId) => {
    await webrtcClient.createOffer(targetId);
  };

  return {
    localStream,
    remoteStreams,
    localVideoRef,
    startCamera,
    startScreenShare,
    callPeer
  };
};

export default useWebRTC;
