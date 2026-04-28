import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const VideoChat = ({ roomId }) => {
  const { user } = useAuth();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const channelRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    // 1. Get Local Media
    const initLocalVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setupWebRTC();
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    initLocalVideo();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomId]);

  const setupWebRTC = () => {
    // 2. Initialize Supabase Channel for Signaling
    const channel = supabase.channel(`webrtc:${roomId}`, {
      config: { broadcast: { ack: false } }
    });
    channelRef.current = channel;

    // 3. Initialize RTCPeerConnection
    const peerConnection = new RTCPeerConnection(iceServers);
    peerConnectionRef.current = peerConnection;

    // Add local tracks to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStreamRef.current);
    });

    // Handle incoming remote tracks
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setHasRemoteVideo(true);
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        channel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: event.candidate, sender: user?.email }
        });
      }
    };

    // Listen for WebRTC Signaling
    channel.on('broadcast', { event: 'offer' }, async ({ payload }) => {
      if (payload.sender === user?.email) return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      channel.send({ type: 'broadcast', event: 'answer', payload: { answer, sender: user?.email } });
    });

    channel.on('broadcast', { event: 'answer' }, async ({ payload }) => {
      if (payload.sender === user?.email) return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(payload.answer));
    });

    channel.on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
      if (payload.sender === user?.email) return;
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch (e) {
        console.error('Error adding received ice candidate', e);
      }
    });

    channel.on('broadcast', { event: 'user-joined-webrtc' }, async ({ payload }) => {
      if (payload.sender === user?.email) return;
      // When a new person joins, create an offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      channel.send({ type: 'broadcast', event: 'offer', payload: { offer, sender: user?.email } });
    });

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Broadcast arrival to trigger offers from existing users
        channel.send({ type: 'broadcast', event: 'user-joined-webrtc', payload: { sender: user?.email } });
      }
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
      <Typography variant="subtitle2">Video Conference</Typography>
      
      <Box sx={{ display: 'flex', gap: 1, height: '140px' }}>
        <Paper sx={{ flex: 1, bgcolor: '#0F172A', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
          />
          <Box sx={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
            <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: isMuted ? 'error.main' : 'white' }} onClick={toggleMute}>
              {isMuted ? <MicOffIcon fontSize="small"/> : <MicIcon fontSize="small"/>}
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: isVideoOff ? 'error.main' : 'white' }} onClick={toggleVideo}>
              {isVideoOff ? <VideocamOffIcon fontSize="small"/> : <VideocamIcon fontSize="small"/>}
            </IconButton>
          </Box>
        </Paper>
        
        <Paper sx={{ flex: 1, bgcolor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 2 }}>
          {hasRemoteVideo ? (
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <Typography variant="caption" color="text.secondary">Waiting...</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default VideoChat;
