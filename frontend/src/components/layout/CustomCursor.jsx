import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@mui/material';

const CustomCursor = () => {
  const theme = useTheme();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);

  // Outer ring spring - slightly slower to create a trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      setIsFinePointer(false);
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('.magnetic-target') || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isFinePointer) return null;

  const color = theme.palette.mode === 'dark' ? 'rgba(255,255,255,' : 'rgba(15,23,42,';

  return (
    <>
      <style>
        {`
          * {
            cursor: none !important;
          }
        `}
      </style>
      <motion.div
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `2px solid ${color}0.5)`,
          pointerEvents: 'none',
          zIndex: 9999,
          backgroundColor: isHovering ? `${color}0.1)` : 'transparent',
          boxShadow: isHovering ? `0 0 20px ${color}0.2)` : 'none', // Trail glow effect
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
          borderWidth: isHovering ? '1px' : '2px',
        }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          style={{
            width: 6,
            height: 6,
            backgroundColor: `${color}1)`,
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isHovering ? 0 : 1
          }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
