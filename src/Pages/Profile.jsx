import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import {
  followAndUnfollowUser,
  getUserProfile,
  resetProfile,
} from "../Toolkit/slices/userProfileSlice";
import NewPostPrompt from "../Components/NewPostPrompt";
import PostCard from "../Components/PostCard";
import Achivements from "../Components/Achivements";
import { FaShare } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaCopy } from "react-icons/fa";
import Loader from "../Components/Loader";
import Header from "../Components/Header";
const Profile = () => {
  const { id } = useParams(); // User profile id from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  // Get profile and posts from Redux state
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const profile = useSelector((state) => state.userProfile.user);
  const posts = useSelector((state) => state.userProfile.posts);
  const isFollowing = useSelector((state) => state.userProfile.isFollowing);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility

  const [isCopied, setIsCopied] = useState(false);
  const postUrl = window.location.href;
  // Function to handle the opening of the popup
  const handleShareClick = () => {
    setIsPopupOpen(true); // Open the popup when the button is clicked
  };
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setIsCopied(true); // Set copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };
  const [owner, setOwner] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false);

  // First useEffect: fetch user profile if the id doesn't match myProfile._id
  useEffect(() => {
    if (!id) return;
    dispatch(resetProfile());
    // Fetch the profile for the given ID
    dispatch(getUserProfile(id)).then(() => {
      // Check ownership after fetching the profile
      if (id === myProfile?._id) {
        setOwner(true);
      } else {
        setOwner(false);
      }
    });
  }, [id, myProfile]);

  const handleToggleContent = () => {
    setIsContentOpen(!isContentOpen);
  };
  const handleFollow = () => {
    const body = {
      followId: id,
    };
    dispatch(followAndUnfollowUser(body));
  };
  // If the profile data is still loading, show a loading message
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const text = "Check out this post!";
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleWhatsAppShare = () => {
    const text = "Check out this Profile!";
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      text
    )}%20${encodeURIComponent(postUrl)}`;
    window.open(whatsappUrl, "_blank");
  };


  if (!profile) {
    return <Loader />;
  }

  return (
    <div className="">
      <Header />
      <div className="container grid grid-cols-1 md:grid-cols-6 gap-6 items-center mt-4">
        {/* User Image Section */}
        <div className="md:col-span-2 flex justify-center relative">
          <img
            src={profile?.profilePicture?.url}
            alt="User"
            className="md:w-64 md:h-64 w-44 h-44 object-cover rounded-full border-4 border-bgPrimary"
          />
        </div>

        {/* User Info Section */}
        <div className="md:col-span-4 text-center md:text-left">
          {/* Stats Section */}
          <div className="max-w-sm mx-auto md:mx-0 justify-center bg-opacity-60 bg-white backdrop-blur-sm text-bgPrimary rounded-2xl grid grid-cols-3 gap-4 p-4">
            <div className="text-center">
              <p className="md:text-2xl text-lg font-bold text-bgPrimary">
                {profile?.followers?.length}
              </p>
              <p className="md:text-md text-sm font-medium text-bgPrimary ">
                Followers
              </p>
            </div>
            <div className="border-x-2 border-t-textBox text-center">
              <p className="md:text-2xl text-lg font-bold text-bgPrimary">
                {profile?.following?.length}
              </p>
              <p className="md:text-md text-sm font-medium text-bgPrimary">
                Following
              </p>
            </div>
            <div className="text-center">
              <p className="md:text-2xl text-lg font-bold text-bgPrimary">
                {profile?.posts?.length}
              </p>
              <p className="md:text-md text-sm font-medium text-bgPrimary">
                Posts
              </p>
            </div>
          </div>

          {/* Name and Username Section */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-3xl font-bold text-bgPrimary w-full sm:w-auto text-center sm:text-left">
                {profile?.fullname}
              </p>

              {owner && (
                <FaUserEdit
                  className="text-2xl text-gray-600 hover:text-bgPrimary cursor-pointer hidden md:block"
                  onClick={() => navigate("/updateprofile")}
                  title="Edit Profile"
                />
              )}

              {!owner && (
                <div className="flex justify-center w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    className="bg-bgPrimary text-2xl font-bold text-white px-6 py-3 rounded-xl hover:bg-blue-500 w-full sm:w-auto"
                    onClick={handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
            </div>

            <p className="text-xl font-semibold text-lightText">
              @{profile?.username}
            </p>
            <p className="text-md md:text-lg font-medium text-left mt-2 text-lightText">
              {profile?.bio}
            </p>
            <div className="mt-4 flex items-center justify-center text-gray-700 gap-5">
              {owner && (
                <FaUserEdit
                  className="text-2xl text-gray-600 hover:text-bgPrimary cursor-pointer block md:hidden"
                  onClick={() => navigate("/updateprofile")}
                  title="Edit Profile"
                />
              )}
              {profile?.koFiUrl ? (
                <a
                  href={profile?.koFiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    height="36"
                    style={{ border: "0px", height: "36px" }}
                    src="https://storage.ko-fi.com/cdn/kofi5.png?v=6"
                    alt="Buy Me a Coffee at ko-fi.com"
                  />
                </a>
              ) : null}
              <button
                type="button"
                aria-label="Like post"
                className={`flex items-center text-right  space-x-1 cursor-pointer ${
                  isPopupOpen ? "text-blue-500" : "text-gray-700"
                } hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out rounded-full px-2 py-1`}
                onClick={handleShareClick}
              >
                <FaShare className="text-xl" />
              </button>
            </div>
            {isPopupOpen && (
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
                onClick={handleClosePopup}
              >
                {/* Popup Box */}
                <div
                  className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full"
                  onClick={(e) => e.stopPropagation()} // Prevent popup from closing when clicked inside
                >
                  <div className="flex justify-between items-center mb-4">
                    {/* Heading aligned to the left */}
                    <h2 className="text-xl text-left">Share this Profile</h2>

                    {/* Close button aligned to the right */}
                    <button
                      className="bg-gray-500 text-white py-2 px-4 rounded-full"
                      onClick={handleClosePopup}
                    >
                      Close
                    </button>
                  </div>

                  {/* URL Field and Copy Button */}
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      value={postUrl}
                      readOnly
                      className="border border-gray-300 rounded-md p-2 w-full text-sm"
                    />
                    <button
                      className="bg-gray-500 text-white p-2 rounded-full"
                      onClick={handleCopyClick}
                    >
                      <FaCopy />
                    </button>
                  </div>
                  {isCopied && (
                    <div className="text-green-500 text-sm mb-2">
                      URL copied to clipboard!
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div className="space-x-4 mb-4 flex">
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-full flex items-center space-x-2"
                      onClick={handleFacebookShare}
                    >
                      <FaFacebookF />
                    </button>
                    <button
                      className="bg-blue-400 text-white py-2 px-4 rounded-full flex items-center space-x-2"
                      onClick={handleTwitterShare}
                    >
                      <FaTwitter />
                    </button>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-full flex items-center space-x-2"
                      onClick={handleWhatsAppShare}
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
            <div className="md:mx-10">
      {/* New Post Prompt */}
      {owner && (
        <div className=" my-4">
          <NewPostPrompt />
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-t-xl my-4 w-full">
        <Achivements />
      </div>

      {/* User's Posts */}
      <div className="rounded-t-xl overflow-hidden col-span-12 md:col-span-9 bg-white mt-2 mb-3 shadow-lg">
        <div className="text-bgSecondary p-4 bg-bgPrimary flex justify-between items-center"  onClick={handleToggleContent}>
          <p className="text-xl md:text-2xl font-semibold text-left">
            My Journeys
          </p>
          <p
            className="text-xl md:text-3xl text-right cursor-pointer"
           
          >
            {isContentOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
          </p>
        </div>

        {/* Content Section with smooth transition */}
        <div
          className={`flex flex-col transition-all duration-500 ease-in-out ${
            isContentOpen
              ? "h-auto opacity-100"
              : "h-0 opacity-0 pointer-events-none"
          }`}
          style={{
            transitionProperty: "height, opacity",
          }}
        >
          {isContentOpen && posts?.length > 0
            ? posts?.map((post, index) => <PostCard key={index} post={post} />)
            : isContentOpen && (
                <p className=" text-center font-bold text-xl text-lightText  p-6">
                  No posts available.
                </p>
              )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
