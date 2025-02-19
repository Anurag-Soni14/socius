import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/data-uri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const register = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    if (!username || !fullname || !email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({
      username,
      fullname,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(201).json({
        message: "invalid credentials",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        return res.status(201).json({
            message: "invalid credentials",
            success: false,
          });
    }

    const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY,{expiresIn: '7d'});

    // populate each post id in the post array
    const populatedPosts = await Promise.all(
      user.posts.map( async (postId) => {
          const post = await Post.findById(postId);
          if(post.author.equals(user._id)){
              return post;
          }
          return null;
      })
  )
    
    user = {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
      coverPhoto: user.coverPhoto,
      bio: user.bio,
      gender: user.gender,
      location: user.location,
      website: user.website,
      followers: user.followers,
      followings: user.followings,
      posts: user.posts,
      liked: user.liked,
      saved: user.saved,
      interests: user.interests,
      joinedAt: user.joinedAt,
      isPrivate: user.isPrivate,
      blockedUsers: user.blockedUsers
    }

    return res.cookie('token', token, {httpOnly: true, sameSite: 'strict', maxAge: 7*24*60*60*1000}).json({
      message: `Welcome Back! ${user.username}`,
      success: true,
      user
    })
  } catch (error) {
    console.log(error);
  }
};


export const logout = async (req, res)=>{
  try {
    return res.cookie('token', "", {maxAge: 0}).json({
      message: "logged out successfully",
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const getProfile = async (req, res)=>{
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('saved').populate('followers').populate('followings').select('-password');
    return res.status(200).json({
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUser = async (req, res)=>{
  try {
    const userId = req.id;
    let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('saved').populate('followers').populate('followings').select('-password');
    return res.status(200).json({
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { username, fullname, email, bio, gender, coverPhoto, interests, isPrivate } = req.body; // Destructure interests and isPrivate

    const profilePic = req.files?.profilePic ? req.files.profilePic[0] : null; // Check if profilePic exists
    let cloudResponse;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // If profilePic exists, upload to Cloudinary
    if (profilePic) {
      try {
        const fileUri = getDataUri(profilePic);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      } catch (err) {
        return res.status(500).json({
          message: "Failed to upload profile picture",
          success: false,
          error: err.message,
        });
      }
    }

    const updatedFields = {};
    if (username && username !== user.username) updatedFields.username = username;
    if (fullname && fullname !== user.fullname) updatedFields.fullname = fullname;
    if (email && email !== user.email) updatedFields.email = email;
    if (bio && bio !== user.bio) updatedFields.bio = bio;
    if (gender && gender !== user.gender) updatedFields.gender = gender;
    if (profilePic && cloudResponse) updatedFields.profilePic = cloudResponse.secure_url;
    if (coverPhoto) updatedFields.coverPhoto = coverPhoto; // Handle the coverPhoto update if necessary
    if (interests) updatedFields.interests = interests.split(",").map((interest) => interest.trim()); // Handle interests as an array
    if (isPrivate !== undefined) updatedFields.isPrivate = isPrivate; // Ensure privacy is handled

    if (Object.keys(updatedFields).length === 0) {
      return res.status(200).json({
        message: "No changes detected in profile.",
        success: true,
        user,
      });
    }

    Object.assign(user, updatedFields);
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in editProfile:", error);
    return res.status(500).json({
      message: "Something went wrong while updating the profile",
      success: false,
      error: error.message,
    });
  }
};





export const suggestedUsers = async (req, res) =>{
  try {
    const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password");
    if(!suggestedUsers){
      return res.status(400).json({
        message: "Currently do not have any users",
        success: false
      })
    }
    return res.status(200).json({
      users: suggestedUsers,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const followOrUnfollow = async (req, res) => {
  try {
    const userId = req.id; // Logged-in user ID
    const followingUserId = req.params.id; // User to follow/unfollow

    if (userId === followingUserId) {
      return res.status(400).json({
        message: "You can't follow and unfollow yourself",
        success: false
      });
    }

    const user = await User.findById(userId);
    const followingUser = await User.findById(followingUserId);

    if (!user || !followingUser) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    const isFollowing = user.followings.includes(followingUserId);

    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        User.findByIdAndUpdate(userId, { $pull: { followings: followingUserId } }, { new: true }),
        User.findByIdAndUpdate(followingUserId, { $pull: { followers: userId } }, { new: true })
      ]);

      const newUserData = await User.findById(userId);
      const newFollowingUser = await User.findById(followingUserId);
      return res.status(200).json({
        message: "Unfollowing",
        user: newUserData,
        followingUser: newFollowingUser,
        success: true
      });
    } else {
      // Follow logic
      await Promise.all([
        User.findByIdAndUpdate(userId, { $push: { followings: followingUserId } }, { new: true }),
        User.findByIdAndUpdate(followingUserId, { $push: { followers: userId } }, { new: true })
      ]);

      const newUserData = await User.findById(userId);
      const newFollowingUser = await User.findById(followingUserId);

       // ✅ Send real-time notification to followed user
       //const notification = {
        //type: "follow",
        //message: `${user.username} started following you.`,
        //senderId: userId,
        //receiverId: followingUserId,
        //timestamp: new Date(),
      //};

      const notification = {
        type: "follow",
        userId: userId,
        userDetails: user,
        message: `started following you.`,
      };

      const receiverSocketId = getReceiverSocketId(followingUserId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", notification);
      }

      return res.status(200).json({
        message: "Following",
        user: newUserData,
        followingUser: newFollowingUser,
        success: true
      });
    }
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    return res.status(500).json({
      message: "An error occurred while processing your request",
      error: error.message,
      success: false
    });
  }
};
