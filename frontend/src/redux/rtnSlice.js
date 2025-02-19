import { createSlice } from "@reduxjs/toolkit";

// Load notification history from localStorage
const loadNotificationHistory = () => {
  const storedHistory = localStorage.getItem("notificationHistory");
  return storedHistory ? JSON.parse(storedHistory) : [];
};

const initialState = {
  newNotifications: [],
  notificationHistory: loadNotificationHistory(),
  messageNotification: [],
};

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      if (!Array.isArray(state.newNotifications)) {
        state.newNotifications = [];
      }
      state.newNotifications.push(action.payload);
    },

    setMessageNotification: (state, action) => {
      if (!Array.isArray(state.messageNotification)) {
        state.messageNotification = [];
      }
      state.messageNotification.push(action.payload);
    },

    markNotificationsAsSeen: (state) => {
      if (!Array.isArray(state.newNotifications)) {
        state.newNotifications = [];
      }
      if (!Array.isArray(state.notificationHistory)) {
        state.notificationHistory = [];
      }
      state.notificationHistory = [
        ...state.newNotifications,
        ...state.notificationHistory,
      ];
      state.newNotifications = [];
      localStorage.setItem(
        "notificationHistory",
        JSON.stringify(state.notificationHistory)
      );
    },

    clearLikeNotifications: (state) => {
      state.newNotifications = [];
    },

    clearMessageNotifications: (state) => {
      state.messageNotification = [];
    },

    clearAllNotifications: (state) => {
      state.notificationHistory = []; // Clear all stored notifications
      localStorage.removeItem("notificationHistory"); // Remove from localStorage
    },
  },
});

export const {
  addNotification,
  setMessageNotification,
  markNotificationsAsSeen,
  clearLikeNotifications,
  clearMessageNotifications,
  clearAllNotifications,
} = rtnSlice.actions;

export default rtnSlice.reducer;
