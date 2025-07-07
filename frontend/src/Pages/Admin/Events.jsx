import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import config from '../../config';

const userId = Cookies.get("userId");

export const Events = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        console.log(id);
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin/events/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Reg", data)
          setParticipants(data.events);
        } else {
          toast.error(data.message || "Failed to fetch event data");
        }
      } catch (error) {
        toast.error("Error fetching event data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/collegeRep/delete/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });
      const data = await response.json();
      if (data.res === "ok") {
        toast.success("Event deleted successfully");
        const updatedEvents = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin/events/${id}`);
        const updatedEventsData = await updatedEvents.json();
        if (updatedEvents.ok) {
          setParticipants(updatedEventsData.events);
        } else {
          toast.error("Error fetching updated events");
        }
      } else {
        toast.error("Error deleting event");
      }
    } catch (error) {
      toast.error("Error deleting event");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-900 py-8">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-gray-800 text-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Events</h2>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading events...</p>
          ) : participants.length > 0 ? (
            <table className="table-auto w-full text-left bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-yellow-500">#</th>
                  <th className="px-8 py-2 text-yellow-500">Event Name</th>
                  <th className="px-4 py-2 text-red-500">Delete</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant._id} className="border-t border-gray-600">
                    <td className="px-4 py-2">{index + 1}</td>
                    <Link to={`/event/${participant._id}`}>
                      <td className="px-8 py-2">{participant.eventName}</td>
                    </Link>
                    <td className="px-4 py-2">
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400" onClick={() => handleDeleteEvent(participant._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center">No Events available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
