import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  activeChat: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
  },
});

export const { addMessage, setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
