export const setupFullscreenMonitor = (onViolation) => {
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      onViolation({
        type: 'FULLSCREEN_EXIT',
        severity: 'HIGH',
        details: 'Candidate exited full screen mode'
      });
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);

  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };
};
