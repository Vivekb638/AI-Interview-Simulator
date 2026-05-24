import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSession: null,
  alerts: [], // Store all incoming real-time alerts
  candidates: {}, // Map of candidateId to their monitoring status
  isFullScreen: false,
  status: 'idle', // idle, in-progress, completed
};

export const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.activeSession = action.payload;
      state.status = 'in-progress';
    },
    addAlert: (state, action) => {
      const payload = action.payload;
      state.alerts.unshift({
        id: payload.id || Date.now(),
        candidateId: payload.candidateId,
        type: payload.type || payload.alertType,
        severity: payload.severity || 'LOW',
        details: payload.details,
        timestamp: payload.timestamp || new Date().toISOString()
      });
      
      // Update candidate specific status
      if (payload.candidateId) {
        if (!state.candidates[payload.candidateId]) {
          state.candidates[payload.candidateId] = { warningCount: 0, highestSeverity: 'LOW', lastActivity: payload.timestamp };
        }
        
        const candidate = state.candidates[payload.candidateId];
        candidate.warningCount += 1;
        candidate.lastActivity = payload.timestamp;
        
        // Upgrade severity if needed
        const severities = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
        if (severities[payload.severity] > severities[candidate.highestSeverity]) {
          candidate.highestSeverity = payload.severity;
        }
      }
    },
    setFullScreenStatus: (state, action) => {
      state.isFullScreen = action.payload;
    },
    resetMonitoring: () => {
      return initialState;
    }
  }
});

export const { setSession, addAlert, setFullScreenStatus, resetMonitoring } = monitoringSlice.actions;
export default monitoringSlice.reducer;
