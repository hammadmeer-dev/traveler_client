import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import { followAndUnfollowUser } from "../Toolkit/slices/userProfileSlice";

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const [owner, setOwner] = useState(false);

  useEffect(() => {
    if (!user?._id || !myProfile?._id) return;
    setOwner(user._id === myProfile._id);
    const isUserFollowed = myProfile?.following?.some((followedUser) =>
      typeof followedUser === "string"
        ? followedUser === user._id
        : followedUser._id === user._id
    );

    setIsFollowing(isUserFollowed);
  }, [user, myProfile]);

  const handleProfileClick = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleFollow = (e) => {
    e.stopPropagation(); // prevent profile redirection
    dispatch(followAndUnfollowUser({ followId: user._id }));
    setIsFollowing((prev) => !prev);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer p-5 w-full mx-auto mt-2"
      onClick={handleProfileClick}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="border-2 border-blue-500 rounded-full">
            <ProfileImage
              userProfileImage={user?.profilePicture?.url}
              userId={user._id}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {user?.fullname}
            </h3>
            <p className="text-sm text-gray-500">@{user?.username}</p>
          </div>
        </div>

        {!owner && (
          <button
            onClick={handleFollow}
            className={`${
              isFollowing
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 text-sm rounded-xl`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Bio */}
      {user?.bio && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{user.bio}</p>
      )}
    </div>
  );
};

export default ProfileCard;
