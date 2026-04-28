import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Chat = ({ roomId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    // Setup Supabase Channel for Realtime Broadcast
    const roomChannel = supabase.channel(`room:${roomId}`, {
      config: { broadcast: { ack: false } }
    });

    roomChannel
      .on('broadcast', { event: 'message' }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Tell others you joined
          roomChannel.send({
            type: 'broadcast',
            event: 'message',
            payload: { system: true, text: `${user?.email} joined the room.` }
          });
        }
      });
      
    setChannel(roomChannel);

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [roomId, user]);

  const sendMessage = () => {
    if (!inputVal.trim() || !channel) return;
    
    const messageData = {
      sender: user?.email,
      text: inputVal.trim(),
      timestamp: new Date().toISOString()
    };

    // Optimistically update local UI
    setMessages((prev) => [...prev, messageData]);
    
    // Broadcast via Supabase
    channel.send({
      type: 'broadcast',
      event: 'message',
      payload: messageData
    });
    
    setInputVal('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" sx={{ borderBottom: '1px solid #333', pb: 1, mb: 2 }}>
        Live Chat
      </Typography>
      
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((msg, idx) => (
          msg.system ? (
            <Typography key={idx} variant="caption" color="text.secondary" align="center">
              {msg.text}
            </Typography>
          ) : (
            <Paper 
              key={idx} 
              sx={{ 
                p: 1.5, 
                maxWidth: '85%', 
                alignSelf: msg.sender === user?.email ? 'flex-end' : 'flex-start',
                bgcolor: msg.sender === user?.email ? 'primary.main' : 'background.paper',
                color: msg.sender === user?.email ? 'primary.contrastText' : 'text.primary'
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, opacity: 0.8 }}>
                {msg.sender === user?.email ? 'You' : msg.sender}
              </Typography>
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
          )
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          variant="outlined" 
          size="small" 
          fullWidth
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default Chat;
