import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosClient } from "../utils/axiosClient";
import PostCard from "../Components/PostCard";
import ProfileCard from "../Components/ProfileCard";
import { IoSearchSharp } from "react-icons/io5";

const Search = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("all"); // all | users | posts
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest
  const query = searchParams.get("query");

const handleSearch = () => {
  const trimmedQuery = searchTerm.trim();
  if (trimmedQuery) {
    const encoded = encodeURIComponent(trimmedQuery);
    setSearchParams({ query: encoded });
  }
};

useEffect(() => {
  if (!query) return;

  const decodedQuery = decodeURIComponent(query);
  setSearchTerm(decodedQuery);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/post/search?query=${encodeURIComponent(decodedQuery)}`);
      setSearchResults(res.data.result);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, [query]);


  // Helper: Parse "timeAgo" strings like "2 hours ago" into minutes
  const parseTimeAgo = (timeAgo) => {
    if (!timeAgo) return Number.MAX_SAFE_INTEGER;
    const [amountStr, unit] = timeAgo.split(" ");
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount)) return Number.MAX_SAFE_INTEGER;

    switch (unit) {
      case "minute":
      case "minutes":
        return amount;
      case "hour":
      case "hours":
        return amount * 60;
      case "day":
      case "days":
        return amount * 60 * 24;
      case "week":
      case "weeks":
        return amount * 60 * 24 * 7;
      case "month":
      case "months":
        return amount * 60 * 24 * 30;
      case "year":
      case "years":
        return amount * 60 * 24 * 365;
      default:
        return Number.MAX_SAFE_INTEGER;
    }
  };

  // Sort posts based on parsed timeAgo in minutes
  const getSortedPosts = () => {
    if (!searchResults.posts) return [];

    return [...searchResults.posts].sort((a, b) => {
      const aMinutes = parseTimeAgo(a.timeAgo);
      const bMinutes = parseTimeAgo(b.timeAgo);
      return sortOrder === "latest" ? aMinutes - bMinutes : bMinutes - aMinutes;
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="md:min-h-24 min-h-16 bg-gradient-to-r from-blue-400 to-teal-400 text-white py-4 text-center">
        
      </div>

      {/* Search Bar */}
      <div className="mx-auto mt-10 flex justify-center items-center relative w-full max-w-md border-b-2 pb-3">
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

      {/* Type Filter */}
      <div className="flex md:gap-4 gap-2 mt-6 justify-center items-center">
  {/* Filter Buttons */}
  {["all", "users", "posts"].map((type) => (
    <button
      key={type}
      className={`md:px-4 px-2 py-1 rounded-lg ${
        filter === type
          ? "bg-blue-500 text-white"
          : "bg-white text-gray-700 border"
      }`}
      onClick={() => setFilter(type)}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  ))}

  {/* Sort dropdown only if filtering posts */}
  {filter === "posts" && (
    <>
      <span className="text-gray-500 md:mx-2 mx-1">|</span>
      <select
        className="border border-gray-300 rounded-lg md:px-3 px-2 py-1 text-gray-700"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </>
  )}
</div>


      {/* Time Filter (only show if posts filter is active) */}
      

      {/* Search Results */}
      <div className="container mx-auto mt-6 px-4">
        <h2 className="text-xl font-semibold mb-4">
          Results for: <span className="text-blue-600">{query}</span>
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Users */}
            {(filter === "all" || filter === "users") && (
              <>
                <h3 className="font-bold mt-4">Users:</h3>
                {searchResults.users?.length > 0 ? (
                  searchResults.users.map((user) => (
                    <ProfileCard key={user._id} user={user} />
                  ))
                ) : (
                  <p className="text-gray-500">No users found.</p>
                )}
              </>
            )}

            {/* Posts */}
            {(filter === "all" || filter === "posts") && (
              <>
                <h3 className="font-bold mt-4">Posts:</h3>
                {getSortedPosts().length > 0 ? (
                  getSortedPosts().map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                ) : (
                  <p className="text-gray-500">No posts found.</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
