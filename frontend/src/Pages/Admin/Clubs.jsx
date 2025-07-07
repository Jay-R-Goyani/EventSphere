import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import config from '../../config';

const userId = Cookies.get("userId");

export const Clubs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin/clubs/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        const data = await response.json();
        if (response.ok) {
          setParticipants(data.representatives);
        } else {
          toast.error(data.message || "Failed to fetch club");
        }
      } catch (error) {
        toast.error("Error fetching club");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Clubs</h2>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading clubs...</p>
          ) : participants.length > 0 ? (
            <table className="table-auto w-full text-left bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-yellow-500">#</th>
                  <th className="px-4 py-2 text-yellow-500">Name</th>
                  <th className="px-4 py-2 text-yellow-500">Email</th>
                  <th className="px-4 py-2 text-yellow-500">Events</th>
                  <th className="px-4 py-2 text-yellow-500">Blogs</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant._id} className="border-t border-gray-600">

                    <td className="px-4 py-2">{index + 1}</td>
                    <Link to={`/admin-events/${participant._id}`}>
                      <td className="px-4 py-2">{participant.clubName}</td>
                    </Link>
                    <td className="px-4 py-2">{participant.email || "N/A"}</td>
                    <td className="px-4 py-2">
                      <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition' onClick={() => navigate(`/admin-events/${participant._id}`)}>
                        Show
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition' onClick={() => navigate(`/admin-blogs/${participant._id}`)}>
                        Show
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center">No clubs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
