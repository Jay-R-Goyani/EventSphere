import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import Cookies from "js-cookie"
import config from "../../config";

const type = Cookies.get("type");

export const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_API || "http://localhost:3000"}/api/blog`);
        console.log("API Response:", response);
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          console.error("Expected an array, but received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch suggestions based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `${config.BACKEND_API || "http://localhost:3000/"}api/blog/suggestions?q=${debouncedQuery}`
          );
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error.message);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedQuery]);

  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog) =>
        blog.title?.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : [];

  return (

  <div className="bg-black">
    <div className="container mx-auto mt-12 p-4 ">

    <Navbar></Navbar>

    <div className="relative flex justify-between items-center mb-8 mt-20">
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="Search blog by title..."
          className="w-[515px] px-3 py-2 border rounded-md flex items-center gap-2 bg-gray-700 text-white"
          // className="p-3 border rounded-md w-full shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md z-10">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchQuery(suggestion.title);
                  setShowSuggestions(false);
                }}
              >
                <strong>{suggestion.title}</strong>
                <div className="text-sm text-gray-500">
                  {suggestion.college || "Unknown College"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {type === "club" && <Link
        to="/add-blog"
        className="bg-blue-600 text-white px-5 py-3 rounded-md shadow-md ml-4 hover:bg-blue-700"
      >
        Add Blog
      </Link>
      }
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800 hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col mb-6"
          >
            <Link to={`/blogs/${blog._id}`}>
              <div className="relative">
                <img
                  src={blog.images?.[0] || "https://via.placeholder.com/600x300"}
                  alt={blog.title}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-yellow-400 mb-2 truncate">{blog.title}</h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{blog.content.substring(0, 80)}...</p>
                <div className="flex items-center mt-auto pt-4 border-t border-gray-800">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold mr-3">
                      {blog.clubId?.clubName ? blog.clubId.clubName[0] : 'A'}
                    </span>
                    <p className="text-sm text-yellow-300 font-semibold mb-0">{blog.clubId?.clubName || "Anonymous"}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No blogs found</p>
      )}
    </div>

    </div>

    <div className="mt-0">
    <Footer></Footer>
    </div>
  </div>

  );
};

export default BlogPage;