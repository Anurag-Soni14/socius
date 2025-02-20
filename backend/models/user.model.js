import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    profilePic: { type: String, },
    coverPhoto: { type: String, },
    bio: { type: String, maxlength: 160 },
    gender: { type: String, enum: ["male", "female"] },
    location: { type: String },
    website: { type: String },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    interests: [{ type: String }], // Array of interests (e.g., "Technology", "Music")
    joinedAt: { type: Date, default: Date.now },

    // Privacy & Security
    isPrivate: { type: Boolean, default: false }, // If true, only approved followers can see posts
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
