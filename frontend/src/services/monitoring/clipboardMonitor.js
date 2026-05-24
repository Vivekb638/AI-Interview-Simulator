export const setupClipboardMonitor = (onViolation) => {
  const handleCopy = (e) => {
    onViolation({
      type: 'COPY_ATTEMPT',
      severity: 'LOW',
      details: 'Candidate attempted to copy content'
    });
  };

  const handlePaste = (e) => {
    onViolation({
      type: 'PASTE_ATTEMPT',
      severity: 'MEDIUM',
      details: 'Candidate attempted to paste content'
    });
  };

  document.addEventListener('copy', handleCopy);
  document.addEventListener('paste', handlePaste);

  return () => {
    document.removeEventListener('copy', handleCopy);
    document.removeEventListener('paste', handlePaste);
  };
};
