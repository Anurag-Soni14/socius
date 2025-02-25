import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import UserInfoWithButton from "../components/UserInfoWithButton";
import { useParams } from "react-router-dom";
import useGetUserProfile from "@/hooks/useGetUserProfile";

const FollowPage = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("followers");

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-base-100 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h1 className="text-3xl font-bold text-center text-primary mb-6">
        Connections
      </h1>

      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="w-full flex relative">
          <TabsTrigger
            value="followers"
            className={`w-1/2 py-3 text-lg font-semibold text-center transition-all relative ${
              activeTab === "followers"
                ? "text-primary font-bold"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers
            {activeTab === "followers" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
            )}
          </TabsTrigger>
          <div className="w-[1px] bg-gray-400 dark:bg-gray-600"></div>
          <TabsTrigger
            value="following"
            className={`w-1/2 py-3 text-lg font-semibold text-center transition-all relative ${
              activeTab === "following"
                ? "text-primary font-bold"
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
            {activeTab === "following" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary" />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers">
          <div className="mt-6 space-y-4 px-4 md:px-6">
            {userProfile?.followers?.length > 0 ? (
              userProfile.followers.map((user) => (
                <UserInfoWithButton key={user._id} user={user} />
              ))
            ) : (
              <p className="text-gray-500 text-center italic">
                No followers yet.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="following">
          <div className="mt-6 space-y-4 px-4 md:px-6">
            {userProfile?.followings?.length > 0 ? (
              userProfile.followings.map((user) => (
                <UserInfoWithButton key={user._id} user={user} />
              ))
            ) : (
              <p className="text-gray-500 text-center italic">
                Not following anyone yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowPage;
