import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addAlert, setCheatingDetected } from '../redux/slices/monitoringSlice';
import socketClient from '../services/socketClient';

const useAntiCheat = (roomId, candidateId, enabled = true) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    // 1. Visibility & Tab Switch API
    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch(addAlert({ type: 'warning', message: 'Tab switched or minimized.' }));
        dispatch(setCheatingDetected(true));
        socketClient.emitToMonitoring('tab-switch', { roomId, candidateId, timestamp: Date.now() });
      }
    };

    // 2. Fullscreen API Exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        dispatch(addAlert({ type: 'error', message: 'Exited fullscreen mode.' }));
        socketClient.emitToMonitoring('fullscreen-exit', { roomId, candidateId });
      }
    };

    // 3. Copy / Paste Blocking
    const handleCopy = (e) => {
      e.preventDefault();
      dispatch(addAlert({ type: 'warning', message: 'Copying is disabled.' }));
    };

    const handlePaste = (e) => {
      e.preventDefault();
      dispatch(addAlert({ type: 'warning', message: 'Pasting is disabled.' }));
      socketClient.emitToMonitoring('cheating-alert', { 
        roomId, candidateId, alertType: 'paste_attempt', severity: 'medium' 
      });
    };

    // 4. Right Click Blocking
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Attach Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      // Cleanup Listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [enabled, roomId, candidateId, dispatch]);

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err.message);
      });
    }
  };

  return { requestFullscreen };
};

export default useAntiCheat;
