import { useState } from "react";
import React from "react";
import authPng from "../../assets/Images/Tokyo-pana 1.png";
import logoLight from "../../assets/Images/logoLight.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { setItem, KEY_ACCESS_TOKEN } from "../../utils/LocalStorageManager";
import { setLoggedIn } from "../../Toolkit/slices/appConfigSlice";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSendingResetLink, setIsSendingResetLink] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname || "/home";

  const submitHandler = async () => {
    try {
      const response = await axiosClient.post("auth/login", {
        email,
        password,
      });

      if (response.data.status === "error") {
        return toast.error(response.data.message);
      }

      console.log(response);
      setItem(KEY_ACCESS_TOKEN, response.data.result.token);
      dispatch(setLoggedIn(true));
      navigate(from, { replace: true });
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error("Login failed! Please try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSendingResetLink(true);
    try {
      const response = await axiosClient.post("auth/forget-pasword", {
        email: forgotPasswordEmail,
      });

      // ✅ Check the actual HTTP status code
      if (response.status === 200) {
        toast.success("Password reset link sent to your email!");
        setShowForgotPassword(false);
      } else {
        toast.error(response.data.message || "Failed to send reset link");
      }
    } catch (err) {
      console.log(err);

      // ✅ More detailed error message handling
      if (err.response && err.response.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsSendingResetLink(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center overflow-x-hidden grid md:grid-cols-7">
      {/* Left Section */}
      <div className="col-span-3 h-screen bg-[#C7A5EA] hidden sm:flex flex-col items-center justify-center relative">
        <div className="text-left text-2xl font-bold text-[rgba(0,0,0,0.55)] sm:ml-10 mt-20 sm:mt-0">
          <p>
            Get reliable and accurate travel
            <br /> information all on one site.
          </p>
          <img src={authPng} alt="Travel illustration" className="mt-8" />
        </div>
      </div>

      {/* Right Section */}
      <div className="col-span-4 flex items-center justify-center bg-white h-screen px-4 sm:px-0">
        <div className="w-full max-w-md">
          <div className="sm:ml-10">
            <p className="text-xl sm:text-2xl font-bold text-[#2A2B2C] mb-4">
              Log In to Traveler
            </p>
            <label className="text-base sm:text-large text-[#2A2B2C] font-semibold mb-2 sm:mb-4">
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              className="px-4 py-2 bg-textBox rounded w-full mb-4"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <label className="text-base sm:text-large text-[#2A2B2C] font-semibold mb-2 sm:mb-4">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 bg-textBox rounded w-full mb-4"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <p
              className="mb-6 text-right text-bgPrimary underline underline-offset-1 text-xs sm:text-sm mt-1 cursor-pointer"
              onClick={() => setShowForgotPassword(true)}
            >
              Forget Password?
            </p>
            <button
              className="px-4 py-2 bg-bgPrimary text-white font-bold rounded w-full"
              onClick={submitHandler}
            >
              Sign In
            </button>
            <p className="text-center text-sm sm:text-base mt-4">
              Not a Member Yet?{" "}
              <span className="text-bgPrimary cursor-pointer">
                <Link to="/signup">Sign Up</Link>
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <p className="mb-4">
              Enter your email address to receive a password reset link
            </p>
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 border rounded w-full mb-4"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowForgotPassword(false)}
                disabled={isSendingResetLink}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-bgPrimary text-white rounded"
                onClick={handleForgotPassword}
                disabled={isSendingResetLink}
              >
                {isSendingResetLink ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
