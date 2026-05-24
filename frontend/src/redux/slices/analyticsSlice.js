import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  loading: false,
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAnalyticsData, setLoading } = analyticsSlice.actions;
export default analyticsSlice.reducer;
