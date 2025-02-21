import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaMapMarkerAlt, FaGlobe, FaUser, FaEnvelope, FaCalendarAlt, FaLock, FaUsers } from "react-icons/fa";

const PersonalInfo = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-base-100 min-h-screen flex flex-col items-center text-base-content shadow-md">
      {/* Profile Header */}
      <div className="w-full relative h-48 rounded-lg overflow-hidden">
        {user?.coverPhoto ? (
          <img
            src={user?.coverPhoto}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-80"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-80 bg-gradient-to-r from-primary to-secondary"></div>
        )}
      </div>

      {/* Profile Picture & Name */}
      <div className="relative flex flex-col items-center mt-[-64px] z-10">
        <div className="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg overflow-hidden bg-base-200 flex items-center justify-center">
          <Avatar className="w-full h-full rounded-full">
            <AvatarImage src={user?.profilePic || "/default-avatar.png"} className="w-full h-full object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-3xl font-bold mt-4">{user?.fullname}</h2>
        <p className="text-lg opacity-80">@{user?.username}</p>
      </div>

      {/* User Info Section */}
      <div className="w-full bg-base-200 shadow-lg rounded-lg p-6 flex flex-col items-center mt-4">
        {user?.bio && (
          <p className="italic text-center text-lg max-w-2xl mb-4 opacity-80">"{user.bio}"</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-3xl">
          <InfoItem icon={<FaUser className="text-primary" />} label="Gender" value={user?.gender || "Not specified"} />
          <InfoItem icon={<FaMapMarkerAlt className="text-secondary" />} label="Location" value={user?.location || "Not set"} />
          <InfoItem
            icon={<FaGlobe className="text-accent" />}
            label="Website"
            value={user?.website ? (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {user.website}
              </a>
            ) : "No website"}
          />
          <InfoItem icon={<FaEnvelope className="text-info" />} label="Email" value={user?.email} />
          <InfoItem icon={<FaCalendarAlt className="text-warning" />} label="Joined" value={new Date(user?.joinedAt).toLocaleDateString()} />
          <InfoItem icon={<FaLock className="text-error" />} label="Privacy" value={user?.isPrivate ? "Private" : "Public"} />
          <InfoItem icon={<FaUsers className="text-success" />} label="Followers" value={user?.followers?.length || 0} />
          <InfoItem icon={<FaUsers className="text-success" />} label="Following" value={user?.followings?.length || 0} />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-base-100 p-3 rounded-lg shadow-sm">
    {icon}
    <div>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-md font-semibold">{value}</p>
    </div>
  </div>
);

export default PersonalInfo;
