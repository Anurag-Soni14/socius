import { Camera } from "lucide-react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const { userProfile } = useSelector((store) => store.auth);
  const imageRef = useRef();

  // Handle input change
  const handleChange = (e) => {
    userProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>

      {/* Profile Picture Section */}
      <div className="relative flex flex-col items-center mb-6">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={userProfile?.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
          />

          {/* Camera Icon Button - Positioned Correctly */}
          <button
            onClick={() => imageRef?.current.click()}
            className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 bg-black p-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            <Camera size={18} className="text-white" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input type="file" ref={imageRef} className="hidden" accept="image/*" />
      </div>

      {/* Profile Stats */}
      <div className="flex justify-center space-x-6 mb-6 text-center">
        {[
          { label: "Posts", count: userProfile?.posts?.length },
          { label: "Followers", count: userProfile?.followers?.length },
          { label: "Following", count: userProfile?.followings?.length },
          { label: "Saved", count: userProfile?.saved?.length },
        ].map((item, index) => (
          <div key={index}>
            <span className="block font-bold text-lg">{item.count}</span>
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Editable Form */}
      <form className="space-y-4">
        {[
          { label: "Username", name: "username", type: "text" },
          { label: "Full Name", name: "fullname", type: "text" },
          { label: "Email", name: "email", type: "email" },
        ].map((field, index) => (
          <div key={index}>
            <label className="block text-gray-700 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={userProfile[field.name]}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div>
          <label className="block text-gray-700 font-medium">Bio</label>
          <textarea
            name="bio"
            value={userProfile.bio}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Gender</label>
          <select
            name="gender"
            value={userProfile.gender}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
