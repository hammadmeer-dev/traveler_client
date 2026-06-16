import React, { useEffect } from "react";
import { KEY_ACCESS_TOKEN, getItem } from "../utils/LocalStorageManager";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyInfo, setLoggedIn } from "../Toolkit/slices/appConfigSlice";
import { useDispatch } from "react-redux";
import { getFeedData } from "../Toolkit/slices/feedSlice";
import Loader from "./Loader";
function RequireUser() {
  const user = getItem(KEY_ACCESS_TOKEN);
  const dispatch = useDispatch();
  const location = useLocation();

  const myProfile = useSelector((state) => state.appConfig.myProfile); // Get profile from Redux
  const status = useSelector((state) => state.appConfig.status);

  // Fetch user info only if it's not already available
  useEffect(() => {
    if (status === "idle") {
      if (status === "idle") {
        dispatch(getMyInfo())
          .then(() => {
            dispatch(setLoggedIn(true));
          })
          .catch((error) => {
            console.error("Failed to get user info:", error);
            // Handle error if needed
          });
      }
    }
  }, [dispatch, myProfile]);
  if (status === "loading") {
    return <Loader />;
  }
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequireUser;
