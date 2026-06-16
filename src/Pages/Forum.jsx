import React, { useEffect, useState } from "react";
import pana from "../assets/Images/Onlineworld-pana1.png";
import Header from "../Components/Header";
import PostCard from "../Components/PostCard";
import Sidebar from "../Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loader";
import { getFeedData } from "../Toolkit/slices/feedSlice";

const Forum = () => {
  const dispatch = useDispatch();
  const [active, setActive] = useState("feed");
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const feedStatus = useSelector((state) => state.feed.status);
  const feed = useSelector((state) => state.feed.feed);
  const followerPosts = feed.filter((post) =>myProfile?.following?.includes(post.owner._id))
  const myPosts = feed.filter((post) => post.owner._id === myProfile._id);
  
  return (
    <div className="bg-gray-100 h-screen">
      {/* Header Section */}
          <div className=" md:min-h-24 min-h-16 bg-gradient-to-r from-blue-400 to-teal-400 text-white md:py-4 text-center ">
    </div>

      {/* Content Section */}
      <div className="md:container md:h-4/5 h-dvh mx-auto md:mt-4 grid grid-cols-1 md:grid-cols-12 md:gap-4  sm:gap-2 md:px-4">
        {/* Sidebar Section */}
        <div className="col-span-12 md:col-span-3">
          <div className="sticky top-24 h-full bg-white md:shadow md:rounded-lg  px-4 py-1" style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <Sidebar active={active} setActive={setActive} />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="col-span-12 md:col-span-9 overflow-y-scroll bg-white shadow md:rounded-lg p-4">
          {feedStatus === "loading" && <div>
            <Loader/>
          </div>}

          {/* Only render feed posts if feed is an array and has data */}
          {active === "feed" &&
            (Array.isArray(feed) && feed.length > 0 ? (
              feed.map((post) => (
                <PostCard key={`feed-${post.id}`} post={post} />
              ))
            ) : (
              <div>No posts available.</div>
            ))}
          {active === "followers" &&
            (Array.isArray(followerPosts) && followerPosts.length > 0 ? (
              followerPosts.map((post) => (
                <PostCard key={`followers-${post.id}`} post={post} />
              ))
            ) : (
              <div>No posts available.</div>
            ))}
          {active === "myPosts" &&
            (Array.isArray(myPosts) && myPosts.length > 0 ? (
              myPosts.map((post) => (
                <PostCard key={`myPosts-${post.id}`} post={post} />
              ))
            ) : (
              <div>No posts available.</div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
