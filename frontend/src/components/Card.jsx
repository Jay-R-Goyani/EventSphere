import React from 'react'
import { useNavigate } from 'react-router-dom';

function Card(props) {
    const navigate = useNavigate();
    const handleImageClick = (id) => {
        navigate(`/event/${id}`);
    };
    const { event } = props;
    return (
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-gray-800 group">
            <div className="relative">
                <img
                    src={event.poster}
                    alt={event.eventName}
                    className="w-full h-64 object-cover group-hover:opacity-80 transition duration-300"
                    onClick={() => handleImageClick(event._id)}
                />
                <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                    {event.date ? new Date(event.date).toLocaleDateString() : 'Upcoming'}
                </div>
            </div>
            <div className="p-5 bg-gray-900">
                <h3 className="text-xl font-bold text-yellow-400 mb-2 truncate">{event.eventName}</h3>
                <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-yellow-300">Venue:</span> {event.venue}</p>
                <p className="text-sm text-gray-300 mb-1"><span className="font-semibold text-yellow-300">Organized By:</span> {event.createdBy}</p>
            </div>
        </div>
    )
}

export default Card