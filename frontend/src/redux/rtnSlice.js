import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likeNotification: [],
  messageNotification: [],
  followNotification: [], // Ensure this is initialized
  commentNotification: [], // Ensure this is initialized
};

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState,
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },

    setMessageNotification: (state, action) => {
      state.messageNotification.push(action.payload);
    },

    setFollowNotification: (state, action) => {
      if (!state.followNotification) {
        state.followNotification = []; // Ensure array exists
      }
      state.followNotification.push(action.payload);
    },

    setCommentNotification: (state, action) => {
      if (!state.commentNotification) {
        state.commentNotification = []; // Ensure array exists
      }
      state.commentNotification.push(action.payload);
    },

    clearLikeNotifications: (state) => {
      state.likeNotification = [];
    },
    clearMessageNotifications: (state) => {
      state.messageNotification = [];
    },
    clearFollowNotifications: (state) => {
      state.followNotification = [];
    },
    clearCommentNotifications: (state) => {
      state.commentNotification = [];
    },
  },
});

export const {
  setLikeNotification,
  setMessageNotification,
  setFollowNotification,
  setCommentNotification,
  clearLikeNotifications,
  clearMessageNotifications,
  clearFollowNotifications,
  clearCommentNotifications,
} = rtnSlice.actions;

export default rtnSlice.reducer;
