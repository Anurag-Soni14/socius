import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePic: user?.profilePic,
    username: user?.username,
    fullname: user?.fullname,
    email: user?.email,
    bio: user?.bio,
    gender: user?.gender,
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePic: file });
  };

  const inputChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const editProfileHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (input.username) formData.append("username", input.username);
    if (input.fullname) formData.append("fullname", input.fullname);
    if (input.email) formData.append("email", input.email);
    if (input.bio) formData.append("bio", input.bio);
    if (input.gender) formData.append("gender", input.gender);

    if (input.profilePic && input.profilePic instanceof File) {
      formData.append("profilePic", input.profilePic);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/v1/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          username: res.data.user?.username,
          fullname: res.data.user?.fullname,
          email: res.data.user?.email,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePic: res.data.user?.profilePic,
        };

        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>

      <div className="relative flex flex-col items-center mb-6">
        <div className="relative">
          {/* <img
            src={input?.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
          /> */}
          <Avatar className="size-24 rounded-full object-cover border-4 border-gray-300">
            <AvatarImage src={input?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <button
            onClick={() => imageRef?.current.click()}
            className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 bg-black p-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            <Camera size={18} className="text-white" />
          </button>
        </div>
        <input
          type="file"
          ref={imageRef}
          onChange={fileChangeHandler}
          className="hidden"
          accept="image/*"
        />
      </div>

      <div className="flex justify-center space-x-6 mb-6 text-center">
        {[
          { label: "Posts", count: user?.posts?.length },
          { label: "Followers", count: user?.followers?.length },
          { label: "Following", count: user?.followings?.length },
          { label: "Saved", count: user?.saved?.length },
        ].map((item, index) => (
          <div key={index}>
            <span className="block font-bold text-lg">{item.count}</span>
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      <form className="space-y-4" onSubmit={editProfileHandler}>
        <div>
          <Label className="block text-gray-700 font-medium">Username</Label>
          <Input
            type="text"
            name="username"
            value={input?.username}
            onChange={inputChangeHandler}
            className="w-full p-3 my-2 focus-visible:ring-transparent border rounded-md"
          />
        </div>
        <div>
          <Label className="block text-gray-700 font-medium">Full name</Label>
          <Input
            type="text"
            name="fullname"
            value={input?.fullname}
            onChange={inputChangeHandler}
            className="w-full p-3 my-2 focus-visible:ring-transparent border rounded-md"
          />
        </div>
        <div>
          <Label className="block text-gray-700 font-medium">Email</Label>
          <Input
            type="email"
            name="email"
            value={input?.email}
            onChange={inputChangeHandler}
            className="w-full p-3 my-2 focus-visible:ring-transparent border rounded-md"
          />
        </div>

        <div>
          <Label className="block text-gray-700 font-medium">Bio</Label>
          <Textarea
            name="bio"
            value={input?.bio}
            onChange={inputChangeHandler}
            className="w-full p-3 my-2 focus-visible:ring-transparent border rounded-md"
            rows="3"
          ></Textarea>
        </div>

        <div>
          <Label className="block text-gray-700 font-medium">Gender</Label>
          <select
            name="gender"
            value={input?.gender}
            onChange={inputChangeHandler}
            className="w-full p-3 my-2 focus-visible:ring-transparent border rounded-md focus:outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {loading ? (
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            <Loader2 className="mr-2 size-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={editProfileHandler}
            className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition"
          >
            Save Changes
          </Button>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
