import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routers/user.route.js";
import postRoute from "./routers/post.route.js";
import messageRoute from "./routers/message.route.js";
import { app, server, io } from "./socket/socket.js";  // Make sure `io` is imported

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOption = {
    origin: "http://localhost:5173",  // Ensure this matches frontend
    methods: ["GET", "POST"],
    credentials: true,
};
app.use(cors(corsOption));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.get("/", (req, res) => {
    return res.status(200).json({ message: "Hello, server is running", success: true });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
});
