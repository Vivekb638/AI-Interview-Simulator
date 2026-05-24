export const setupKeyboardMonitor = (onViolation) => {
  const handleKeyDown = (e) => {
    // Prevent default print screen or right click (context menu is a different event but similar intent)
    if (e.key === 'PrintScreen') {
      onViolation({
        type: 'SCREENSHOT_ATTEMPT',
        severity: 'HIGH',
        details: 'Candidate attempted to take a screenshot'
      });
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onViolation({
      type: 'RIGHT_CLICK',
      severity: 'LOW',
      details: 'Candidate right-clicked'
    });
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('contextmenu', handleContextMenu);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('contextmenu', handleContextMenu);
  };
};
