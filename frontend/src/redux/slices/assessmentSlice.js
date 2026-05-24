import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentAssessment: null,
  code: '',
  output: null,
};

export const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setAssessment: (state, action) => {
      state.currentAssessment = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
  },
});

export const { setAssessment, setCode, setOutput } = assessmentSlice.actions;
export default assessmentSlice.reducer;
