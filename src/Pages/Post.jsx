import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../Toolkit/slices/feedSlice";
import { getMyInfo } from "../Toolkit/slices/appConfigSlice";
import { KEY_ACCESS_TOKEN, getItem } from "../utils/LocalStorageManager";
import RequireUser from "../Components/RequireUser";
import PostComp from "../Components/Post";
import CommentCard from "../Components/CommentCard";
import AddComment from "../Components/AddComment";
import { PageNotFound } from "./PageNotFound";
import Loader from "../Components/Loader";
import { useLocation } from "react-router-dom";

const Post = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const commentSectionRef = useRef(null);
  const navigate = useNavigate();

  const token = getItem(KEY_ACCESS_TOKEN);
  const isLoggedIn = useSelector((state) => state.appConfig.isLoggedIn);
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const appStatus = useSelector((state) => state.appConfig.status);
  const location = useLocation();

  const feed = useSelector((state) => state.feed.feed);
  const feedStatus = useSelector((state) => state.feed.status);

  const post = feed.find((post) => post.id === id);

  // Load user info if token exists and profile is not loaded
  useEffect(() => {
    if (token && appStatus === "idle") {
      dispatch(getMyInfo());
    }
  }, [token, appStatus, dispatch]);

  // Load post if not in Redux store
  useEffect(() => {
    if (!post && feedStatus !== "loading") {
      dispatch(fetchPostById(id));
    }
  }, [id, dispatch, post, feedStatus]);

  // Scroll to comment
  const scrollToComment = () => {
    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle loading states
  if (feedStatus === "loading" || (token && appStatus === "loading")) {
    return <Loader />;
  }

  // If post fetch failed
  if (feedStatus === "failed") {
    return <PageNotFound />;
  }

  // If post still not found
  if (!post) {
    return null;
  }

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: location }, replace: true });
  };

  return (
    <>
      <div className="md:h-24 h-16 block bg-gradient-to-r from-blue-400 to-teal-400"></div>
      <div className="flex items-center justify-center">
        <div className="w-full md:w-4/6">
          <div className="border bg-white py-6 px-2 md:p-10 md:rounded-lg">
            <PostComp post={post} scrollToComment={scrollToComment} />
          </div>

          <div className="md:mt-8 mt-0 border bg-white md:p-10 p-2 md:rounded-lg">
            <p className="m-3 text-2xl font-semibold" ref={commentSectionRef}>
              Comments
            </p>

            {isLoggedIn ? (
              <AddComment postId={id} />
            ) : (
              <div className="p-4 border rounded bg-yellow-50 text-yellow-700 font-medium">
                <p>
                  <button
                    onClick={handleLoginRedirect}
                    className="text-blue-600 underline"
                  >
                    Login
                  </button>{" "}
                  to like or add a comment.
                </p>
              </div>
            )}

            {post.comments?.map((comment, index) => (
              <CommentCard key={index} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
