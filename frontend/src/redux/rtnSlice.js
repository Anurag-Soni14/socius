import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
    messageNotification: [],
  },
  reducers: {
    // Handle Like & Dislike Notifications
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },

    // Handle Message Notifications
    setMessageNotification: (state, action) => {
      state.messageNotification.push(action.payload);
    },

    // Clear Notifications when viewed
    clearLikeNotifications: (state) => {
      state.likeNotification = [];
    },
    clearMessageNotifications: (state) => {
      state.messageNotification = [];
    },
  },
});

export const { setLikeNotification, setMessageNotification, clearLikeNotifications, clearMessageNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
