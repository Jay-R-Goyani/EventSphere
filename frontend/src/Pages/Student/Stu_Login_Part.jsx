import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import axios from "axios"
import config from '../../config';
import bg1 from "../../../public/assets/images/bg1.jpg";
import bg2 from "../../../public/assets/images/bg2.jpg";

export const Stu_Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { storeTokenInLs } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // "http://localhost:3000/api/auth/student-signup"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when login starts
    try {
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        // Clear all storages and cookies before setting new token
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(';').forEach(cookie => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
        toast.success("Login Successful !!");
        const responsedata = await response.json();
        const type = "user";
        Cookies.set("token", responsedata.token, {expires : 7});
        Cookies.set("name", responsedata.representative.name, {expires : 7});
        Cookies.set("userId", responsedata.representative.id, {expires : 7});
        Cookies.set("type", type, {expires : 7});
        Cookies.set("image", responsedata.representative.image, {expires : 7});
        storeTokenInLs(responsedata.token, responsedata.representative.name, responsedata.representative.id, type, responsedata.representative.image);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (response.status === 401 || response.status === 403) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      console.error("Error during login", error);
    } finally {
      setLoading(false); // Set loading state to false after login attempt
    }
  };

  useEffect(() => {
    const handleDelete = async () => {
      try {
        const response = await axios.delete(`${config.BACKEND_API || "http://localhost:3000"}/api/auth/deleteusers`);
        
      } catch (error) {
        toast.error("Error deleting profile");
      }
    };
    handleDelete();
  }, []);

  return (
    <div
    className="flex flex-col items-center justify-center w-full min-h-screen bg-cover bg-center py-8"
    style={{ backgroundImage: `url(${bg2})` }}>
      <ToastContainer/>
      <Link
          to="/"
          className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-600 font-semibold"
        >
          &#8592; Back to Home
        </Link>
      <div className="w-full max-w-md bg-gray-800 text-white shadow-lg rounded-lg p-8 bg-gray-900/50 backdrop-blur-md text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        <h3 className="text-lg text-center mb-4">Login to your Account</h3>
        <p className="text-center mb-6">Let's start exploring events tailored for you!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-400">Email Address *</label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={user.email}
              onChange={handleInput}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-400">Password * </label>
            <input
              className="w-full p-3 border border-gray-600 rounded bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={user.password}
              onChange={handleInput}
              required
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div></div>
            <Link to="/forgot-password-stu" className="text-sm text-blue-400 hover:underline">Forgot Password?</Link>
          </div>
          <div className="flex justify-center">
            <button
              className={`w-full text-white p-3 rounded font-bold transition-colors ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link className="text-green-500 hover:underline" to="/student-register">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};