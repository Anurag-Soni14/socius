import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Camera, CameraIcon, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const AdminEditUser = () => {
  const imageRef = useRef();
  const coverRef = useRef();
  const navigate = useNavigate();
  const param = useParams();
  const userId = param.id;
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePic: user?.profilePic || "",  // Ensure it's a string
  coverPhoto: user?.coverPhoto || "",
  username: user?.username || "",
  fullname: user?.fullname || "",
  email: user?.email || "",
  bio: user?.bio || "",
  gender: user?.gender || "male",  // Default to 'male' or 'female'
  location: user?.location || "",
  website: user?.website || "",
  interests: user?.interests?.join(", ") || "",
  isPrivate: user?.isPrivate || false, // Ensure it's boolean
  });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/user/admin/get-user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(data.user);
        setInput({
          profilePic: data.user.profilePic || "",
        coverPhoto: data.user.coverPhoto || "",
        username: data.user.username || "",
        fullname: data.user.fullname || "",
        email: data.user.email || "",
        bio: data.user.bio || "",
        gender: data.user.gender || "male",
        location: data.user.location || "",
        website: data.user.website || "",
        interests: data.user.interests?.join(", ") || "",
        isPrivate: data.user.isPrivate || false,
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchUser();
  }, [userId]);
  const fileChangeHandler = (e, field) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, [field]: file });
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "interests") {
      // Handle interests as an array
      setInput({
        ...input,
        [name]: value.split(",").map((interest) => interest.trim()), // Ensure it's an array
      });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const editProfileHandler = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (input[key] !== undefined && input[key] !== null) {
        if (key === "interests" && Array.isArray(input[key])) {
          // Only join interests if it's an array
          formData.append(key, input[key].join(", "));
        } else {
          // For all other fields, append them as they are
          formData.append(key, input[key]);
        }
      }
    });
  
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
        navigate("/admin/users");
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
    <div className="p-6 max-w-3xl mx-auto bg-base-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">
        Edit Profile
      </h2>

      <div className="relative flex flex-col items-center mb-6">
        <div className="relative w-full h-40 bg-base-300 rounded-md">
          {user?.coverPhoto ? (
            <img
              src={input.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary to-secondary"></div>
          )}
          <button
            className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 text-xs rounded-full flex items-center gap-1 hover:bg-gray-700"
            aria-label="Change Cover"
            onClick={() => coverRef.current.click()} // Trigger file input
          >
            <CameraIcon className="size-4" />
            Change
          </button>
        </div>
        <input
          type="file"
          ref={coverRef}
          onChange={(e) => fileChangeHandler(e, "coverPhoto")}
          className="hidden"
          accept="image/*"
        />
        <div className="relative -mt-10">
          <Avatar className="size-24 border-4 border-base-300">
            <AvatarImage src={input.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <button
            onClick={() => imageRef?.current.click()}
            className="absolute bottom-0 right-0 bg-base-200 p-2 rounded-full"
          >
            <Camera size={18} className="text-white" />
          </button>
        </div>
        <input
          type="file"
          ref={imageRef}
          onChange={(e) => fileChangeHandler(e, "profilePic")}
          className="hidden"
          accept="image/*"
        />
      </div>

      <form className="space-y-4" onSubmit={editProfileHandler}>
        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          value={input.username}
          onChange={inputChangeHandler}
        />
        <Label>Full name</Label>
        <Input
          type="text"
          name="fullname"
          value={input.fullname}
          onChange={inputChangeHandler}
        />
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={input.email}
          onChange={inputChangeHandler}
        />
        <Label>Bio</Label>
        <Textarea
          name="bio"
          value={input.bio}
          onChange={inputChangeHandler}
          rows="3"
        />
        <Label>Gender</Label>
        <div className="mb-4">
          <select
            name="gender"
            value={input.gender}
            onChange={inputChangeHandler}
            className="select select-bordered w-full bg-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <Label>Location</Label>
        <Input
          type="text"
          name="location"
          value={input.location}
          onChange={inputChangeHandler}
          className="mb-4"
        />
        <Label>Website</Label>
        <Input
          type="text"
          name="website"
          value={input.website}
          onChange={inputChangeHandler}
        />
        <Label>Interests (comma-separated)</Label>
        <Input
          type="text"
          name="interests"
          value={input.interests}
          onChange={inputChangeHandler}
        />
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="privacy"
            checked={input.isPrivate}
            onChange={
              () => setInput({ ...input, isPrivate: !input.isPrivate }) // Toggle the value
            }
          />
          <Label htmlFor="privacy">Private Account</Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-white p-3 rounded-md font-semibold hover:bg-primary-focus transition"
        >
          {loading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AdminEditUser;
