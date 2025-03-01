import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import getDataUri from "../utils/data-uri.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!caption && !image) {
      return res
        .status(400)
        .json({ message: "Post must contain at least an image or a caption" });
    }

    let imageUrl = "";

    if (image) {
      // Convert image buffer to Data URI
      const fileUri = getDataUri(image);

      // Upload to Cloudinary
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      imageUrl = cloudResponse.secure_url;
    }

    // Save post to database
    const post = await Post.create({
      caption,
      image: imageUrl,
      author: authorId,
    });

    // Link post to user
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.error("Error in addNewPost:", error);
    return res.status(500).json({
      message: "Something went wrong while creating the post.",
      error: error.message,
      success: false,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePic" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePic" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePic",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePic" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const likedUser = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    await Post.updateOne({ _id: postId }, { $addToSet: { likes: likedUser } });
    await User.updateOne({ _id: likedUser }, { $addToSet: { liked: postId } });

    const user = await User.findById(likedUser).select("username profilePic");
    const postOwnerId = post.author.toString();

    if (postOwnerId !== likedUser) {
      const notification = {
        type: "like",
        userId: likedUser,
        userDetails: user,
        postId,
        message: `Liked your post`,
      };

      const postOwnerSocketId = getReceiverSocketId(postOwnerId);

      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", notification);
      }
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.error("Error liking post:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    await User.updateOne({ _id: userId }, { $pull: { liked: postId } });


    // Implement socket.io for real-time notifications (if applicable)
    const user = await User.findById(userId).select("username profilePic");
    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      // emit a notification event
      const notification = {
        type: "dislike",
        userId: userId,
        userDetails: user,
        postId,
        message: `Unliked your post`,
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", notification);
    }
    return res.status(200).json({
      message: "Post unliked",
      success: true,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!text) {
      return res.status(400).json({
        message: "comment can not be empty",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePic",
    });

    post.comments.push(comment._id);

    await post.save();
    await User.updateOne({ _id: userId }, { $addToSet: { comments: postId } });


    // ✅ Send real-time notification to post owner
    if (post.author._id.toString() !== userId) {
      // const notification = {
      //   type: "comment",
      //   message: `${comment.author.username} commented on your post.`,
      //   senderId: userId,
      //   receiverId: post.author._id.toString(),
      //   postId,
      //   timestamp: new Date(),
      // };

      const notification = {
        type: "comment",
        userId: userId,
        userDetails: user,
        postId,
        message: `commented on your post.`,
      };

      const receiverSocketId = getReceiverSocketId(post.author._id.toString());

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", notification);
      }
    }

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username",
      "profilePic"
    );

    if (!comments) {
      return res.status(404).json({
        message: "No comments yet",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    // check if the logged in user is the author of the post

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "unauthorised user",
        success: false,
      });
    }

    // delete post

    await Post.findByIdAndDelete(postId);

    // remove the post id from user user model
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);

    user.save();

    // delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "post deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const savedPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const autherId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    const user = await User.findById(autherId);

    if (user.saved.includes(post._id)) {
      // if the post is already saved then remove is from the model
      await user.updateOne({ $pull: { saved: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "post removed from bookmark",
        success: true,
      });
    } else {
      // if the post is not saved then save it to the user model
      await user.updateOne({ $addToSet: { saved: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "post added to saved",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};


export const getPostStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    // **1. Total Posts**
    const totalPosts = await Post.countDocuments();

    // **2. New Posts (created today)**
    const newPosts = await Post.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // **3. Total Comments**
    const totalComments = await Comment.countDocuments();

    // **4. New Comments (created today)**
    const newComments = await Comment.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const stats = {
      totalPosts,
      newPosts,
      totalComments,
      newComments,
    };
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching post stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch post stats",
      error: error.message,
    });
  }
};

export const postDelete = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    await post.deleteOne();
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  }
  catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}

export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    } 
    post.caption = caption;
    await post.save();  
    return res.status(200).json({
      message: "Post updated successfully",
      success: true,
    });
  }
  catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
}