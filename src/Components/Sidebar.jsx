import React, { useRef, useState } from "react";
import { PiChatsCircle } from "react-icons/pi";
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { RiWechatPayLine } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import ProfileImage from "./ProfileImage";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaCopy } from "react-icons/fa";

const Sidebar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
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
  const menuItems = [
    { id: "feed", icon: <PiChatsCircle />, label: "Feed" },
    { id: "followers", icon: <RiWechatPayLine />, label: "Followers" },
    { id: "myPosts", icon: <FaEdit />, label: "My Posts" },
    { id: "newPost", icon: <IoIosAddCircle />, label: "New Post" },
  ];
  const postUrl = `${window.location.origin}/profile/${myProfile?._id}`;
  const menuHandler = (item) => {
    if (item.id === "newPost") {
      navigate("/createpost");
    }
  };

  const handleSearch = () => {
    const trimmedQuery = searchTerm.trim();
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <div>
      {/* Profile Card - hidden on mobile */}
      <div className="hidden sm:block border-b-2 pb-2 mt-1">
        <div className="ProfileCard py-2 mx-auto max-w-sm ">
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={myProfile?.profilePicture?.url}
                alt={myProfile?.fullname || "Profile Picture"}
                className="w-24 h-24 rounded-full border-white shadow-md object-cover"
              />
              {/* Status Indicator */}
              <span className="absolute bottom-3 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Name */}
            <h4 className="mt-4 text-lg font-bold text-gray-800">
              {myProfile?.fullname}
            </h4>

            {/* Bio */}
            <h4 className="text-md md:text-md font-medium text-left text-lightText line-clamp-3">
              {myProfile?.bio}
            </h4>
            <div className="space-x-4 mt-2 flex">
              <button
                onClick={handleFacebookShare}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <FaFacebookF size={20} />
              </button>

              <button
                onClick={handleTwitterShare}
                className="text-sky-500 hover:text-sky-700 transition-colors duration-200"
              >
                <FaTwitter size={20} />
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="text-green-500 hover:text-green-700 transition-colors duration-200"
              >
                <FaWhatsapp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center items-center relative w-full max-w-md border-b-2 pb-2 mt-4">
        <input
          ref={inputRef}
          className="py-2 px-4 bg-gray-200 rounded-xl pl-10 pr-10 w-full"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <IoSearchSharp
          className="text-2xl absolute right-3 top-1/2 -translate-y-[68%] text-gray-500 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {/* Menu Buttons */}
      <div className="flex mt-3">
        {menuItems.map((item) => (
          <div key={item.id} className="relative group w-1/4">
            <button
              onClick={() => {
                setActive(item.id);
                menuHandler(item);
              }}
              className={`px-5 py-2 gap-3 flex items-center justify-center w-full text-lg font-semibold transition-all ${
                active === item.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {item.icon}
            </button>

            {/* Tooltip — visible only on large screens */}
            <span
              className="absolute -top-10 left-1/2 -translate-x-1/2 
                   px-2 py-1 bg-gray-800 text-white text-xs rounded 
                   opacity-0 group-hover:opacity-100 
                   transition-opacity duration-300 
                   pointer-events-none hidden lg:block whitespace-nowrap"
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Trending Tags - hidden on mobile */}
      <div className="hidden sm:block">
        <div className="mt-4 rounded-2xl p-3 mx-auto border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
          <h1 className="text-blue-600 text-sm sm:text-md font-bold text-center uppercase tracking-widest">
            Trending Tags
          </h1>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {[
              "#beach",
              "#hiking",
              "#adventure",
              "#mountains",
              "#foodie",
              "#nature",
            ].map((tag, index) => (
              <button
                key={index}
                onClick={() =>
                  navigate(`/search?query=${encodeURIComponent(tag)}`)
                }
                className=" hover:text-blue-800 text-blue-400 rounded-full text-sm transition-all duration-300 ease-in-out"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
