import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const VantaBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      try {
        setVantaEffect(NET({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x8b5cf6,
          backgroundColor: 0x0f172a,
          points: 15.00,
          maxDistance: 20.00,
          spacing: 15.00
        }));
      } catch (e) {
        console.error("Vanta initialization failed:", e);
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <Box ref={myRef} sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, position: 'relative' }}>
      <Box sx={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}
      </Box>
    </Box>
  );
};

export default VantaBackground;
