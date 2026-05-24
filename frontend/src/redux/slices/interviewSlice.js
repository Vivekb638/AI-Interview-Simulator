import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interviews: [],
  currentInterview: null,
};

export const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    setCurrentInterview: (state, action) => {
      state.currentInterview = action.payload;
    },
  },
});

export const { setInterviews, setCurrentInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
