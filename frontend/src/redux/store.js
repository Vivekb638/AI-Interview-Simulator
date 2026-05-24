import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import interviewReducer from './slices/interviewSlice';
import assessmentReducer from './slices/assessmentSlice';
import monitoringReducer from './slices/monitoringSlice';
import chatReducer from './slices/chatSlice';
import analyticsReducer from './slices/analyticsSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    assessment: assessmentReducer,
    monitoring: monitoringReducer,
    chat: chatReducer,
    analytics: analyticsReducer,
    notification: notificationReducer,
  },
});

export default store;
