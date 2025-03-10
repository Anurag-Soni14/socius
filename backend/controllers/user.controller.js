import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/data-uri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { Contact } from "../models/contact-model.js";
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

    if (!isPasswordCorrect) {
      return res.status(201).json({
        message: "invalid credentials",
        success: false,
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // populate each post id in the post array
    // const populatedPosts = await Promise.all(
    //   user.posts.map(async (postId) => {
    //     const post = await Post.findById(postId);
    //     if (post.author.equals(user._id)) {
    //       return post;
    //     }
    //     return null;
    //   })
    // );

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
      blockedUsers: user.blockedUsers,
      isAdmin: user.isAdmin,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome Back! ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("saved")
      .populate("liked")
      .populate("comments")
      .populate("followers")
      .populate("followings")
      .select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("saved")
      .populate("followers")
      .populate("followings")
      .select("-password");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      username,
      fullname,
      email,
      bio,
      gender,
      location,
      website,
      interests,
      isPrivate,
    } = req.body; 

    const profilePic = req.files?.profilePic ? req.files.profilePic[0] : null; // Check if profilePic exists
    const coverPhoto = req.files?.coverPhoto ? req.files.coverPhoto[0] : null;
    let cloudResponse;
    let coverCloudResponse;

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

    // Upload coverPhoto if provided
    if (coverPhoto) {
      try {
        const coverFileUri = getDataUri(coverPhoto);
        coverCloudResponse = await cloudinary.uploader.upload(
          coverFileUri.content
        );
      } catch (err) {
        return res.status(500).json({
          message: "Failed to upload cover photo",
          success: false,
          error: err.message,
        });
      }
    }

    const updatedFields = {};
    if (username && username !== user.username)
      updatedFields.username = username;
    if (fullname && fullname !== user.fullname)
      updatedFields.fullname = fullname;
    if (email && email !== user.email) updatedFields.email = email;
    if (bio && bio !== user.bio) updatedFields.bio = bio;
    if (gender && gender !== user.gender) updatedFields.gender = gender;
    if (location && location !== user.location)
      updatedFields.location = location;
    if (website && website !== user.website) updatedFields.website = website;
    if (profilePic && cloudResponse)
      updatedFields.profilePic = cloudResponse.secure_url;
    if (coverCloudResponse) updatedFields.coverPhoto = coverCloudResponse.secure_url;  // Handle the coverPhoto update if necessary
    if (interests)
      updatedFields.interests = interests
        .split(",")
        .map((interest) => interest.trim()); // Handle interests as an array
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

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required." });
    }

    // Search for users whose username or fullname starts with the query (case-insensitive)
    const users = await User.find({
      $or: [
        { username: { $regex: `^${query}`, $options: "i" } },
        { fullname: { $regex: `^${query}`, $options: "i" } },
      ],
    }).select("username fullname profilePic _id");

    if (users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found." });
    }

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong.",
        error: error.message,
      });
  }
};

// export const suggestedUsers = async (req, res) => {
//   try {
//     const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
//       "-password"
//     );
//     if (!suggestedUsers) {
//       return res.status(400).json({
//         message: "Currently do not have any users",
//         success: false,
//       });
//     }
//     return res.status(200).json({
//       users: suggestedUsers,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };


export const suggestedUsers = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.id).select("interests location followings");

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const { interests, location, followings } = loggedInUser;

    // Base query: Exclude the logged-in user and already followed users
    let query = { _id: { $ne: req.id, $nin: followings } };

    // Filter by interests if the user has interests
    if (interests.length > 0) {
      query.interests = { $in: interests };
    }

    // Filter by location if available
    if (location) {
      query.location = location;
    }

    // Find suggested users
    let suggestedUsers = await User.find(query)
      .select("-password")
      .limit(10) // Limit results for performance
      .lean();

    // Prioritize users with mutual followers
    suggestedUsers = suggestedUsers.map((user) => {
      const mutualFollowers = user.followers?.filter((follower) =>
        followings.includes(follower.toString())
      ).length;
      return { ...user, mutualFollowers };
    });

    // Sort by most mutual followers
    suggestedUsers.sort((a, b) => b.mutualFollowers - a.mutualFollowers);

    // If no users found, return message
    if (suggestedUsers.length === 0) {
      return res.status(200).json({ message: "No suggested users found", success: true, users: [] });
    }

    return res.status(200).json({ users: suggestedUsers, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


export const followOrUnfollow = async (req, res) => {
  try {
    const userId = req.id; // Logged-in user ID
    const followingUserId = req.params.id; // User to follow/unfollow

    if (userId === followingUserId) {
      return res.status(400).json({
        message: "You can't follow and unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(userId);
    const followingUser = await User.findById(followingUserId);

    if (!user || !followingUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = user.followings.includes(followingUserId);

    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $pull: { followings: followingUserId } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          followingUserId,
          { $pull: { followers: userId } },
          { new: true }
        ),
      ]);

      const newUserData = await User.findById(userId);
      const newFollowingUser = await User.findById(followingUserId);
      return res.status(200).json({
        message: "Unfollowing",
        user: newUserData,
        followingUser: newFollowingUser,
        success: true,
      });
    } else {
      // Follow logic
      await Promise.all([
        User.findByIdAndUpdate(
          userId,
          { $push: { followings: followingUserId } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          followingUserId,
          { $push: { followers: userId } },
          { new: true }
        ),
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
        success: true,
      });
    }
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    return res.status(500).json({
      message: "An error occurred while processing your request",
      error: error.message,
      success: false,
    });
  }
};

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be filled.",
        });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {  // Check if user exists
      return res.status(404).json({message: "User not found", success: false});
    }
    return res.status(200).json({user, success: true});
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({message: "Failed to fetch user", success: false, error: error.message});
  }
};

export const editUser = async (req, res) => {
  try {
    const userId = req.id;
    const {
      username,
      fullname,
      email,
      bio,
      gender,
      location,
      website,
      interests,
      isPrivate,
    } = req.body; 

    const profilePic = req.files?.profilePic ? req.files.profilePic[0] : null; // Check if profilePic exists
    const coverPhoto = req.files?.coverPhoto ? req.files.coverPhoto[0] : null;
    let cloudResponse;
    let coverCloudResponse;

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

    // Upload coverPhoto if provided
    if (coverPhoto) {
      try {
        const coverFileUri = getDataUri(coverPhoto);
        coverCloudResponse = await cloudinary.uploader.upload(
          coverFileUri.content
        );
      } catch (err) {
        return res.status(500).json({
          message: "Failed to upload cover photo",
          success: false,
          error: err.message,
        });
      }
    }

    const updatedFields = {};
    if (username && username !== user.username)
      updatedFields.username = username;
    if (fullname && fullname !== user.fullname)
      updatedFields.fullname = fullname;
    if (email && email !== user.email) updatedFields.email = email;
    if (bio && bio !== user.bio) updatedFields.bio = bio;
    if (gender && gender !== user.gender) updatedFields.gender = gender;
    if (location && location !== user.location)
      updatedFields.location = location;
    if (website && website !== user.website) updatedFields.website = website;
    if (profilePic && cloudResponse)
      updatedFields.profilePic = cloudResponse.secure_url;
    if (coverCloudResponse) updatedFields.coverPhoto = coverCloudResponse.secure_url;  // Handle the coverPhoto update if necessary
    if (interests)
      updatedFields.interests = interests
        .split(",")
        .map((interest) => interest.trim()); // Handle interests as an array
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

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }
    const user = await User
      .findById(userId)
      .select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserStats = async (req, res) => {
  try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

      // **1. Total Users**
      const totalUsers = await User.countDocuments();

      // **2. New Users (registered in the last 24 hours)**
      const newUsers = await User.countDocuments({
          createdAt: { $gte: today } // Users created today
      });

      // **3. Today's Active Users (users who logged in today)**
      const activeUsers = await User.countDocuments({
          lastLogin: { $gte: today, $lt: tomorrow } // Users who logged in today
      });

      const userStats = {
        totalUsers,
        newUsers,
        activeUsers
      };
      res.status(200).json({
          success: true,
          userStats,
      });
  } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({
          success: false,
          message: "Failed to fetch user stats",
          error: error.message
      });
  }
};

export const getContactStats = async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const newMessagesToday = await Contact.countDocuments({ createdAt: { $gte: today } });

    // Get the latest message date (for insight purposes)
    const latestMessage = await Contact.findOne().sort({ createdAt: -1 });

    const contactStats = {
      totalMessages,
      newMessagesToday,
      latestMessageDate: latestMessage ? latestMessage.createdAt : null,
    };

    return res.json({
      success: true,
      contactStats,
    });

  } catch (error) {
    console.error("Error fetching contact stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({ success: true, contacts });
  } catch (error) { 
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
  
export const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    if (!contactId) {
      return res.status(400).json({
        message: "Contact ID is required",
        success: false,
      });
    }
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }
    await Contact.findByIdAndDelete(contactId);
    return res.status(200).json({
      message: "Contact deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleContacts = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({message: "Contact not found", success: false});
    }
    return res.status(200).json({contact, success: true});
  } catch (error) {
    console.error("Error fetching contact:", error);
    return res.status(500).json({message: "Failed to fetch contact", success: false, error: error.message});
  }
}
