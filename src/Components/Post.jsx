import React, { useRef, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineModeComment } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import ProfileImage from "./ProfileImage"; // Ensure the path is correct
import Carousel from "./Carousel";
import { getUserProfile, toggleLike } from "../Toolkit/slices/userProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { likeAndUnlikePost } from "../Toolkit/slices/feedSlice";
import { FaShare } from "react-icons/fa";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";

const Post = ({ post, scrollToComment }) => {
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const isLoggedIn = useSelector((state) => state.appConfig.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const [isCopied, setIsCopied] = useState(false);
  const postUrl = window.location.href;
  const location = useLocation();
  console.log(post?.owner?.KoFiUrl);
  // Function to handle the opening of the popup
  const handleShareClick = () => {
    setIsPopupOpen(true); // Open the popup when the button is clicked
  };

  // Function to handle closing of the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setIsCopied(true); // Set copied state to true
      setTimeout(() => setIsCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };
  const formattedHashtags = post?.hashtags?.join(" ") || "";
  const handleUserProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.owner._id}`);
  };
  const handleLike = () => {
    dispatch(likeAndUnlikePost({ postId: post.id }));
    dispatch(toggleLike({ postId: post.id, curUserId: myProfile._id }));
    console.log(post);
  };

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
    const text = "Check out this post!";
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      text
    )}%20${encodeURIComponent(postUrl)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="w-full items-center justify-center">
        <div className=" bg-white transition-shadow duration-300 rounded-lg">
          {/* User Info and Interaction Icons */}
          <div className="flex items-center justify-between mb-4">
            {/* User Information */}
            <div className="flex items-center space-x-3">
              <ProfileImage
                userProfileImage={post?.owner?.avatar?.url}
                userId={post?.owner?._id}
              />
              <div>
                <p
                  className="text-base md:text-lg font-semibold text-gray-800"
                  onClick={handleUserProfile}
                >
                  {post?.owner?.name}
                </p>
                <p className="text-xs md:text-sm font-medium text-gray-500">
                  {post?.timeAgo}
                </p>
              </div>
            </div>

            {/* Like and Comment Buttons */}
            <div className="flex items-center space-x-4 text-gray-600">
              {isLoggedIn ? (
                <button
                  type="button"
                  aria-label="Like post"
                  className={`flex items-center space-x-1 cursor-pointer ${
                    post?.isLikedByUser ? "text-blue-500" : "text-gray-700"
                  } hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out rounded-full bg-slate-200 px-2 py-1`}
                  onClick={handleLike}
                >
                  <AiOutlineLike className="text-xl" />
                  <p className="text-sm">{post?.likesCount}</p>
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Like post"
                  className={`flex items-center space-x-1 cursor-pointer ${
                    post?.isLikedByUser ? "text-blue-500" : "text-gray-700"
                  } hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out rounded-full bg-slate-200 px-2 py-1`}
                  onClick={() => navigate("/login", { state: { from: location }, replace: true })}
                >
                  <AiOutlineLike className="text-xl" />
                  <p className="text-sm">{post?.likesCount}</p>
                </button>
              )}
              <button
                type="button"
                aria-label="Comment on post"
                className="hidden md:flex items-center space-x-1 cursor-pointer hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out rounded-full bg-slate-200 px-2 py-1"
                onClick={scrollToComment}
              >
                <MdOutlineModeComment className="text-xl" />
                <p className="text-sm">{post?.comments?.length}</p>
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mt-4">
              {post?.title}
            </h2>
            <p className="text-xs md:text-base text-gray-600 flex items-center gap-2">
              <ReactStars
                count={5}
                value={post?.rating} // e.g., 3
                edit={false} // read-only
                size={15}
                isHalf={true}
                activeColor="#ffd700"
              />
              <span>
                {" "}
                {formattedHashtags ? "|" : ""} {formattedHashtags}
              </span>
            </p>

            {post?.media?.length > 0 ? <Carousel data={post?.media} /> : ""}

            <p className="text-md md:text-base text-gray-600 mt-2 ">
              {post?.description}
            </p>
            <p className="text-xs md:text-base text-gray-600 ">
              {formattedHashtags}
            </p>
          </div>

          {/* Location Information */}
          <div
            className="mt-4 flex items-center text-gray-700 cursor-pointer"
            onClick={() =>
              navigate(`/search?query=${encodeURIComponent(post?.location)}`)
            }
          >
            <CiLocationOn className="text-lg mr-1" />
            <p className="text-sm">{post?.location}</p>
          </div>
          <div className="mt-4 flex items-center justify-end text-gray-700 gap-5">
            {post?.owner?.koFiUrl ? (
              <a
                href={post?.owner?.koFiUrl}
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
              } hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out rounded-full bg-slate-200 px-2 py-1`}
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
                  <h2 className="text-xl text-left">Share this post</h2>

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
    </>
  );
};

export default Post;
