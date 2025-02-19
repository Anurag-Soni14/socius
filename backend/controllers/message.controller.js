import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import {User} from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage: message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // Establish the conversation if not started yet.
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // Implement socket.io for real-time data transfer
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);

      // Fetch sender details to include in notification
      const sender = await User.findById(senderId).select("username profilePic");

      // Construct notification object
      const notification = {
        type: "message",
        userId: senderId,
        userDetails: sender,
        message: `Sent you a message`,
        conversationId: conversation._id
      };

      // Emit notification event
      io.to(receiverSocketId).emit("notification", notification);
    }

    return res.status(201).json({
      success: true,
      newMessage
    });
  } catch (error) {
    console.log("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};




export const getMessage = async (req, res) => {
  try {
    const senderId = mongoose.Types.ObjectId.createFromHexString(req.id);
const receiverId = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }, // ✅ Fix: Use an array instead of an object
    }).populate("messages"); // ✅ Populates messages with actual message data

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages, // ✅ Ensure messages are sent correctly
    });
  } catch (error) {
    console.log("Error in getMessage:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
};
