import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FiUpload, FiX, FiCheck, FiMapPin } from "react-icons/fi";
import axios from "axios";
import { axiosClient } from "../utils/axiosClient";
import { toast } from "react-hot-toast";
import { addedStory } from "../Toolkit/slices/storySlice";

const UploadStory = () => {
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [location, setLocation] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(
        "Please select an image (JPEG, PNG, GIF) or video (MP4, WebM) file."
      );
      return;
    }

    // Validate file size (20MB max)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("File size too large. Maximum 20MB allowed.");
      return;
    }

    // Revoke previous URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: long } = position.coords;
          resolve({ lat, long });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000 } // 10 seconds timeout
      );
    });
  };

  const uploadFile = async () => {
    if (!file || !title.trim()) {
      toast.error("Please select a file and enter a title.");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);
      setLocationError(false);

      // Step 1: Get Cloudinary signature
      const { data } = await axiosClient.get("/story/generate-signature");
      const { apiKey, timestamp, signature, cloudName } = data.data;

      // Step 2: Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", "Story_Media");

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData,
        {
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded / e.total) * 50);
            setProgress(percent);
          },
          timeout: 120000,
        }
      );

      const uploadedUrl = cloudinaryRes.data.secure_url;
      const publicId = cloudinaryRes.data.public_id;

      // Step 3: Get user location (strict requirement)
      try {
        const { lat, long } = await getLocation();
        setLocation({ lat, long });

        // Step 4: Post story to backend
        const process = await axiosClient.post(
          "/story/addstory",
          { title, url: uploadedUrl, publicId, lat, long },
          {
            onUploadProgress: (e) => {
              const percent = 50 + Math.round((e.loaded / e.total) * 50);
              setProgress(percent);
            },
          }
        );
        dispatch(addedStory(process?.data?.data?.story));
        toast.success(`${process?.data?.message}`);

        // Smooth transition to stories page
        setTimeout(() => navigate("/story", { replace: true }), 1500);
      } catch (locationError) {
        console.error("Location error:", locationError);
        setLocationError(true);
        toast.error("Location permission is required to upload a story.");
        return; // ⛔️ Abort upload if location is not available
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload story. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="w-full h-16 md:h-24 bg-gradient-to-r from-blue-400 to-teal-400" />
      <div className="flex  items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-semibold text-bgPrimary mb-4 text-center">
            Upload a Story
          </h1>

          {/* File Upload Section */}
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 transition hover:border-blue-400">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FiUpload className="text-4xl text-gray-500" />
                <span className="text-sm text-gray-600">
                  Click to select a file
                </span>
                <span className="text-xs text-gray-500 mt-2">
                  Supported formats: JPEG, PNG, GIF, MP4, WebM (Max 20MB)
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                accept="image/jpeg, image/png, image/gif, video/mp4, video/webm"
              />
            </div>
          ) : (
            <div className="mb-4">
              <div className="relative group">
                {file.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md hover:bg-gray-100 transition"
                  title="Remove file"
                >
                  <FiX className="text-red-500 text-lg" />
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p className="truncate">
                  <span className="font-medium">File:</span> {file.name}
                </p>
                <p>
                  <span className="font-medium">Size:</span>{" "}
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {file.type.split("/")[1].toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-4">
            <label
              htmlFor="story-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Story Title
            </label>
            <input
              id="story-title"
              type="text"
              placeholder="What's your story about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 text-right mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Location Status */}
          <div className="mb-4 flex items-center text-sm">
            <FiMapPin className="mr-2" />
            {location ? (
              <span className="text-green-600">Location added</span>
            ) : locationError ? (
              <span className="text-yellow-600">Location not available</span>
            ) : (
              <span className="text-gray-600">
                Location will be added automatically
              </span>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadFile}
            disabled={isUploading || !file || !title.trim()}
            className={`w-full py-3 px-4 text-white rounded-lg transition duration-300 flex items-center justify-center gap-2 ${
              isUploading || !file || !title.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Story"
            )}
          </button>

          {/* Progress Indicator */}
          {progress > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Upload Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {progress === 100 && (
                <div className="flex items-center justify-center text-green-600 text-sm">
                  <FiCheck className="mr-1" /> Upload complete! Redirecting...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Uploading your story...
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadStory;
