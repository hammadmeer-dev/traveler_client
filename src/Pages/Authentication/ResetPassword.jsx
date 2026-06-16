// ResetPassword.js
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
import { toast } from "react-hot-toast";

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
  if (password !== confirmPassword) {
    toast.error("Passwords don't match");
    return;
  }

  setIsResetting(true);
  try {
    const response = await axiosClient.post("auth/reset-password", {
      token,
      newPassword: password
    });

    if (response.status === 200) {
      toast.success("Password reset successfully!");
      navigate("/login", { replace: true }); // 👈 redirect to login
    } else {
      toast.error(response.data.message || "Failed to reset password");
    }
  } catch (err) {
    console.log(err);
    if (err.response && err.response.data?.error) {
      toast.error(err.response.data.error);
    } else {
      toast.error("Failed to reset password. Please try again.");
    }
  } finally {
    setIsResetting(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleResetPassword}
          disabled={isResetting}
        >
          {isResetting ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;