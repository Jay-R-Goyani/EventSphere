import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';
import { useAuth } from '../../Context/AuthProvider';
import Cookies from "js-cookie";
import config from '../../config';

const userId = Cookies.get("userId");

export const AdminProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const image = Cookies.get("image");
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        // console.log("Token being sent:", token);
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin/colleges`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });

        const data = await response.json();
        // console.log("Response status:", response.status);
        // console.log("Response data:", data);
        if (response.status === 401 || data.message === 'Invalid or expired token.') {
          localStorage.removeItem('adminToken');
          toast.error('Session expired. Please log in again.');
          navigate('/');
          return;
        }
        if (response.ok) {
          setColleges(data);
        } else {
          toast.error(data.message || 'Failed to fetch colleges');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error('Error fetching colleges');
      }
    };
    fetchColleges();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            {/* Profile Header */}
            <div className="relative border border-gray-700 rounded-lg p-4 mb-8 bg-gray-800">
              <div className="flex items-center space-x-4">
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=Event Sphere`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                  <h3 className="text-xl font-semibold text-yellow-500">Event Sphere Team</h3>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Colleges':
        return (
          <div className="overflow-y-auto relative border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h4 className="text-lg font-semibold text-yellow-500 mb-2 flex justify-center">Registered Colleges</h4>
            <div className='overflow-y-auto max-h-[40vh] p-4 border-none rounded-lg bg-gray-800'>
              <ul className="list-none pl-0 space-y-4">
                {colleges ? (
                  colleges.map((college) => (
                    <li key={college._id} className="bg-gray-700 p-4 rounded-lg shadow-lg">
                      <Link to={`/admin-clubs/${college._id}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg text-gray-400">{college.name}</span>
                          <span className="text-sm text-gray-400">{college.email}</span>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="bg-gray-700 p-4 rounded-lg shadow-lg text-center text-gray-400">
                    No colleges available
                  </li>
                )}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center top-24 w-full min-h-screen bg-gray-900 pb-24">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8 mt-28">
        <Link
          to="/"
          className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-600 font-semibold"
        >
          &#8592; Back to Home
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            navigate('/');
          }}
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow transition duration-200"
        >
          Logout
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Admin</h2>

        <div className="flex">
          <aside className="w-1/4 space-y-6 pr-4 border-r border-gray-700">
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'profile' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('profile')}
            >
              Profile
            </button>
            <button
              className={`w-full text-left text-lg font-semibold py-2 px-4 rounded-md ${activeSection === 'Colleges' ? 'text-yellow-500 bg-gray-700' : 'text-gray-300 hover:bg-gray-700'}`}
              onClick={() => setActiveSection('Colleges')}
            >
              Colleges
            </button>
          </aside>

          <main className="w-3/4 bg-gray-900 rounded-lg shadow-inner p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};