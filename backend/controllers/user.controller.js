import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/data-uri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      followers: user.followers,
      folliwing: user.followings,
      post: user.posts
    }
    const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY,{expiresIn: '7d'});

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
    let user = await User.findById(userId).select('-password');
    return res.status(200).json({
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const editProfile = async (req, res) =>{
  try {
    const userId = req.id;
    const {bio, gender} = req.body;
    const profilePic = req.file;
    let cloudResponse;

    if(profilePic){
      const fileUri = getDataUri(profilePic);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select('-password');
    if(!user){
      return res.status(404).json({
        message: "user not found",
        success: false
      })
    }

    if(bio) user.bio = bio;
    if(gender) user.gender = gender;
    if(profilePic) user.profilePic = cloudResponse.secure_url;

    await user.save();

    return res.status(201).json({
      message: "Profile updated",
      success: true,
      user
    })

  } catch (error) {
    console.log(error)
  }
}


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

export const followOrUnfollow = async (req, res) =>{
  try {
    const userId = req.id;
    const folliwingUserId = req.params.id;

    if(userId === folliwingUserId){
      return res.status(400).json({
        message: "You can't follow and unfollow yourself",
        success: false
      })
    }

    const user = await User.findById(userId);
    const folliwingUser = await User.findById(folliwingUserId);

    if(!user || !folliwingUser){
      return res.status(400).json({
        message: "user not found",
        success: false
      })
    }

    const isFollowing = user.followings.includes(folliwingUserId)
    if(isFollowing){
      // unfollow logic
      await Promise.all([
        User.updateOne({_id: userId}, {$pull:{followings: folliwingUserId}}),
        User.updateOne({_id: folliwingUserId}, {$pull:{followers: userId}}),
      ])
      return res.status(200).json({
        message:"unfollow",
        success: true
      })
    }else{
      // follow logic
      await Promise.all([
        User.updateOne({_id: userId}, {$push:{followings: folliwingUserId}}),
        User.updateOne({_id: folliwingUserId}, {$push:{followers: userId}}),
      ])
      return res.status(200).json({
        message:"following",
        success: true
      })
    }

  } catch (error) {
    console.log(error);
  }
}