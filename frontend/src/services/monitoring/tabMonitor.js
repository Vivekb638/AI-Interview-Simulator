export const setupTabMonitor = (onViolation) => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      onViolation({
        type: 'TAB_SWITCH',
        severity: 'HIGH',
        details: 'Candidate switched tabs or minimized the window'
      });
    }
  };

  const handleBlur = () => {
    onViolation({
      type: 'WINDOW_BLUR',
      severity: 'MEDIUM',
      details: 'Window lost focus'
    });
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleBlur);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
  };
};
