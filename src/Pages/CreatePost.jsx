import React, { useState } from "react";
import { CiLocationOn, CiCircleInfo } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { axiosClient } from "../utils/axiosClient";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { uploadImagesToCloudinary } from "../utils/cloudinaryUpload"; // adjust path
import Header from "../Components/Header";

export const CreatePost = () => {
  const myProfile = useSelector((state) => state.appConfig.myProfile);
  const [loc, setLoc] = useState("Sialkot, Pakistan");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const navigate = useNavigate();
  const [desc, setDesc] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      setErrorMsg("You can only upload a maximum of 5 images.");
    } else {
      setErrorMsg("");
      setSelectedImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      
      // 1️⃣ Upload images to Cloudinary
      const uploadedMedia = await uploadImagesToCloudinary(selectedImages);

      // 2️⃣ Prepare post data
      const payload = {
        title,
        description: desc,
        location: loc,
        rating,
        hashtags: JSON.stringify(hashtags),
        media: JSON.stringify(uploadedMedia),
      };

      // 3️⃣ Send post data to backend
      const response = await axiosClient.post("/post/createpost", payload);

      if (response.data.statusCode === 201) {
        toast.success("Post uploaded successfully!");

        if (response.data.result.achivement) {
          Swal.fire({
            title: "🎉 Congratulations! You've earned the First Step badge!",
            text: "You Have Created Your First Post",
            imageUrl:
              "https://res.cloudinary.com/djiqzvcev/image/upload/v1739281946/achivement3_hlkpml.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "First Step Badge",
            padding: "3em",
            width: 600,
            color: "#716add",
            background: "#fff url(/images/trees.png)",
            backdrop: `rgba(0,0,123,0.4) url("/images/nyan-cat.gif") left top no-repeat`,
          });
        }

        setTimeout(() => {
          navigate(`/profile/${myProfile._id}`);
        }, 2000);
      } else {
        toast.error("Failed to upload post. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="md:min-h-24 min-h-16 bg-gradient-to-r from-blue-400 to-teal-400 md:mx-20 mx-4 flex justify-center">
           <div className="bg-gradient-to-br from-white to-blue-50 max-w-2xl p-8 rounded-xl shadow-2xl transition-shadow hover:shadow-3xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-bgPrimary tracking-wide drop-shadow-sm">
          Create Your Journey Post
        </h1>

        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <img
              src={myProfile?.profilePicture?.url}
              alt="User Profile"
              className="w-14 h-14 object-cover rounded-full ring-2 ring-bgPrimary shadow-md"
            />
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {myProfile.fullname}
              </p>
              <div className="flex items-center gap-1 text-bgPrimary font-medium">
                <CiLocationOn className="text-2xl" />
                <span className="text-md">{loc}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-4 w-full rounded-lg text-lg font-medium placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-bgPrimary transition"
              required
            />

          <div className="md:p-6 bg-[#E5E5E5] md:bg-white md:rounded-xl md:shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <img
                src={myProfile?.profilePicture?.url}
                alt="User Profile"
                className="w-14 h-14 object-cover rounded-full ring-2 ring-bgPrimary shadow-md"
              />
              <div>
                <p className="text-xl font-semibold text-gray-800">
                  {myProfile.fullname}
                </p>
                <div className="flex items-center gap-1 text-bgPrimary font-medium">
                  <CiLocationOn className="text-2xl" />
                  <span className="text-md">{loc}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mb-6">
              <input
                type="text"
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 p-4 w-full rounded-lg text-lg font-medium placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-bgPrimary transition"
                required
              />

              <textarea
                placeholder="Describe your journey..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={5}
                className="border border-gray-300 p-4 w-full rounded-lg text-md placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-bgPrimary transition resize-none"
                required
              />

              <div className="mb-6">
                <label
                  htmlFor="file-upload"
                  className="relative w-full h-36 border-2 border-dashed border-bgPrimary rounded-lg cursor-pointer flex flex-col items-center justify-center text-bgPrimary hover:bg-bgPrimary hover:text-white transition-all shadow-sm"
                >
                  {selectedImages.length < 5 ? (
                    <>
                      <FiUpload className="text-5xl mb-2" />
                      <p className="text-lg font-semibold">
                        Drag & drop or click to upload (max 5 images)
                      </p>
                      <p className="text-sm mt-1 text-gray-300">
                        JPG, PNG supported
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-semibold text-red-500">
                      Maximum 5 images reached
                    </p>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    multiple
                    disabled={selectedImages.length >= 5}
                  />
                </label>
                {errorMsg && (
                  <p className="text-red-500 text-center mt-2 font-medium">
                    {errorMsg}
                  </p>
                )}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden shadow-md group"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="object-cover h-28 w-full transition-transform group-hover:scale-110"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 opacity-0 group-hover:opacity-90 hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="location-input"
                  className="flex items-center gap-2 mb-2 font-semibold text-bgPrimary text-lg"
                >
                  Location
                  <span
                    data-tooltip-id="location-tooltip"
                    data-tooltip-content="Format: City, Province, Country"
                    className="cursor-pointer text-gray-400 hover:text-bgPrimary transition"
                  >
                    <CiCircleInfo size={18} />
                  </span>
                </label>
                <Tooltip id="location-tooltip" place="top" />
                <input
                  id="location-input"
                  type="text"
                  placeholder="Enter location"
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value);
                    setLoc(e.target.value);
                  }}
                  className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bgPrimary transition"
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-bgPrimary text-lg">
                  Rate this Journey
                </label>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={30}
                  activeColor="#facc15"
                  isHalf={true}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-bgPrimary text-lg">
                  Hashtags (max 5)
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    placeholder="#nature"
                    className="flex-grow border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-bgPrimary transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = hashtagInput.trim();
                      if (
                        trimmed &&
                        hashtags.length < 5 &&
                        !hashtags.includes(trimmed)
                      ) {
                        setHashtags([...hashtags, trimmed]);
                        setHashtagInput("");
                      }
                    }}
                    className="px-5 py-3 bg-bgPrimary text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                  >
                    Add
                  </button>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="bg-bgPrimary/20 text-bgPrimary px-4 py-1 rounded-full text-sm flex items-center gap-2 select-none"
                      >
                        {tag}
                        <button
                          type="button"
                          className="text-red-500 font-bold hover:text-red-600 transition"
                          onClick={() =>
                            setHashtags((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label={`Remove hashtag ${tag}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-lg text-white font-extrabold tracking-wide shadow-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-bgPrimary hover:bg-bgPrimary/90 transition"
                }`}
              >
                {isLoading ? "Uploading..." : "Post Journey"}
              </button>
            </form>
            {isLoading && (
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
                    Uploading your Journey...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
