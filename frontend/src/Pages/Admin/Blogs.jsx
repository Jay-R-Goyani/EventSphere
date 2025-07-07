import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import config from '../../config';

const userId = Cookies.get("userId");

export const Blogs = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteBlog = async (blogId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/collegeRep/delete/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      const data = await response.json();
      if (data.ok === true) {
        toast.success("Blog deleted successfully");
        const token = localStorage.getItem("adminToken");
        const updatedBlogs = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin/blogs/${id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        const updatedBlogsData = await updatedBlogs.json();
        if (updatedBlogs.ok) {
          setParticipants(updatedBlogsData.blogs);
        } else {
          toast.error("Error fetching updated blogs");
        }
      } else {
        toast.error("Error deleting Blogg");
      }
    } catch (error) {
      toast.error("Error deleting Blog");
    }
  }

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/admin/blogs/${id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        const data = await response.json();
        if (response.ok) {
          setParticipants(data.blogs);
          console.log(data.blogs);
        } else {
          toast.error(data.message || "Failed to fetch participant data");
        }
      } catch (error) {
        toast.error("Error fetching participant data");
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
        <h2 className="text-2xl font-bold text-center mb-6">Blogs</h2>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-gray-400 text-center">Loading blogs...</p>
          ) : participants.length > 0 ? (
            <table className="table-auto w-full text-left bg-gray-900 border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-700 ">
                  <th className="px-4 py-2 text-yellow-500">#</th>
                  <th className="px-4 py-2 text-yellow-500">Blog Name</th>
                  <th className="px-4 py-2 text-yellow-500">Delete</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant._id} className="border-t border-gray-600">
                    <td className="px-4 py-2">{index + 1}</td>
                    <Link to={`/blogs/${participant._id}`}>
                      <td className="px-4 py-2">{participant.title}</td>
                    </Link>
                    <td className="px-4 py-2">
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400" onClick={() => handleDeleteBlog(participant._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center">No Blogs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
