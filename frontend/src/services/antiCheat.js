import { setupTabMonitor } from './monitoring/tabMonitor';
import { setupFullscreenMonitor } from './monitoring/fullscreenMonitor';
import { setupClipboardMonitor } from './monitoring/clipboardMonitor';
import { setupKeyboardMonitor } from './monitoring/keyboardMonitor';
import socketClient from './socketClient';

class AntiCheatSystem {
  constructor() {
    this.cleanups = [];
    this.isActive = false;
  }

  start(sessionId) {
    if (this.isActive) return;
    this.isActive = true;
    this.sessionId = sessionId;

    console.log(`Starting Anti-Cheat monitoring for session ${sessionId}`);

    const onViolation = (event) => {
      console.warn('Anti-Cheat Violation:', event);
      socketClient.emitToMonitoring('cheating_event', {
        sessionId: this.sessionId,
        ...event,
        timestamp: new Date().toISOString()
      });
    };

    this.cleanups.push(setupTabMonitor(onViolation));
    this.cleanups.push(setupFullscreenMonitor(onViolation));
    this.cleanups.push(setupClipboardMonitor(onViolation));
    this.cleanups.push(setupKeyboardMonitor(onViolation));
  }

  stop() {
    console.log('Stopping Anti-Cheat monitoring');
    this.cleanups.forEach(cleanup => cleanup());
    this.cleanups = [];
    this.isActive = false;
  }
}

export const antiCheatSystem = new AntiCheatSystem();
