import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/data-uri.js";
import {Comment} from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";


export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Convert image buffer to Data URI
    const fileUri = getDataUri(image);

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Save post to database
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
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
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // like logic

    await Post.updateOne({ $addToSet: { likes: likedUser } });

    await post.save();

    // implement socket io for real time notification

    return res.status(201).json({
      message: "liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
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

    // like logic

    await Post.updateOne({ $pull: { likes: userId } });

    await post.save();

    // implement socket io for real time notification

    return res.status(201).json({
      message: "unliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const text = req.body;

    const post = await Post.findById(postId);

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
    }).populate({
      path: "author",
      select: "username, profilePic",
    });

    post.comments.push(comment._id);

    await post.save();

    return res.status(201).json({
      message: "comment added",
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

    if(!post){
      return res.status(404).json({
        message: 'post not found',
        success: false
      })
    }

    const user = await User.findById(autherId);

    if(user.saved.includes(post._id)){
      // if the post is already saved then remove is from the model
      await user.updateOne({$pull:{saved: post._id}});
      await user.save();
      return res.status(200).json({
        type: 'unsaved',
        message: 'post removed from bookmark',
        success: true
      })
    }else{
      // if the post is not saved then save it to the user model
      await user.updateOne({$addToSet:{saved: post._id}});
      await user.save();
      return res.status(200).json({
        type: 'saved',
        message: 'post added to saved',
        success: true
      })
    }
  } catch (error) {
    console.log(error);
  }
};
