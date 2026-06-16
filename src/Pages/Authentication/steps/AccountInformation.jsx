import React, { useState } from "react";

const AccountInformation = ({ accountInfo, setAccountInfo }) => {
  // State for validation errors
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Validate form inputs on change
  // Validate form inputs on change
const validateField = (id, value) => {
  let error = "";

  // Username validation: should not be an email or empty
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (id === "username") {
    if (!value.trim()) {
      error = "Username is required";
    } else if (emailPattern.test(value)) {
      error = "Username cannot be an email address";
    }
  }

  // Gmail-only email validation
  const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (id === "email" && !gmailPattern.test(value)) {
    error = "Please enter a valid Gmail address (e.g. user@gmail.com)";
  }

  // Password validation: at least 6 characters long
  if (id === "password" && value.length < 6) {
    error = "Password must be at least 6 characters";
  }

  setErrors((prevErrors) => ({
    ...prevErrors,
    [id]: error,
  }));
};

  // Handle input changes for username, email, and password
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAccountInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));

    // Validate the specific field on change
    validateField(id, value);
  };

  return (
    <div className="w-full max-w-md mx-auto sm:mx-0">
      <div className="sm:ml-10 mt-12 sm:mt-18">
        <p className="text-2xl sm:text-3xl font-bold text-[#2A2B2C] mb-4">
          Sign Up to Traveler
        </p>

        {/* Username Label and Input */}
        <label
          htmlFor="username"
          className="text-base sm:text-lg text-[#2A2B2C] font-semibold mb-2 sm:mb-4 block"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter Username"
          value={accountInfo.username}
          onChange={handleInputChange}
          className={`px-4 py-2 bg-textBox border ${
            errors.username ? "border-red-500" : "border-gray-300"
          } rounded w-full mb-2 focus:outline-none focus:ring focus:ring-[#AC68F7]`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-4">{errors.username}</p>
        )}

        {/* Email Label and Input */}
        <label
          htmlFor="email"
          className="text-base sm:text-lg text-[#2A2B2C] font-semibold mb-2 sm:mb-4 block"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter Email"
          value={accountInfo.email}
          onChange={handleInputChange}
          className={`px-4 py-2 bg-textBox border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded w-full mb-2 focus:outline-none focus:ring focus:ring-[#AC68F7]`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-4">{errors.email}</p>
        )}

        {/* Password Label and Input */}
        <label
          htmlFor="password"
          className="text-base sm:text-lg text-[#2A2B2C] font-semibold mb-2 sm:mb-4 block"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter Password"
          value={accountInfo.password}
          onChange={handleInputChange}
          className={`px-4 py-2 bg-textBox border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded w-full mb-2 focus:outline-none focus:ring focus:ring-[#AC68F7]`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">{errors.password}</p>
        )}
      </div>
    </div>
  );
};

export default AccountInformation;
