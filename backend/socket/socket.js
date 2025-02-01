import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active users and their socket IDs
const userSocketMap = {}; // userId --> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    // console.log(`✅ User Connected: userId = ${userId}, socketId = ${socket.id}`);
  }

  // Emit updated online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle real-time messages
  socket.on("sendMessage", (messageData) => {
    const { senderId, receiverId, text } = messageData;

    console.log(`📩 New Message from ${senderId} to ${receiverId}: ${text}`);

    // Save the message in the database (Example - Modify based on your DB schema)
    // You can integrate this inside your `message.route.js` if needed
    // Message.create({ sender: senderId, receiver: receiverId, text });

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData); // ✅ Send real-time message to receiver
      console.log(`🚀 Message sent to receiver (Socket ID: ${receiverSocketId})`);
    } else {
      console.log(`⚠️ Receiver (${receiverId}) is offline, storing message in DB.`);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      // console.log(`❌ User Disconnected: userId = ${userId}, socketId = ${socket.id}`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
