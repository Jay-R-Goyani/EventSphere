import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${config.BACKEND_API || "http://localhost:3000"}/api/event/concerts`, {
          headers: {
            'Content-Type': 'application/json',
          }
        }); // Replace with your API URL
        const data = await response.json();
        // console.log(data);
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners', error);
      }
    };
    fetchBanners();
  }, []);

  // console.log(banners);

  useEffect(() => {
    if (isManual) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [isManual, banners.length]);

  const nextSlide = () => {
    setIsManual(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    setTimeout(() => setIsManual(false), 4000);
  };

  const prevSlide = () => {
    setIsManual(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    setTimeout(() => setIsManual(false), 4000);
  };

  const handleImageClick = (id) => {
    navigate(`/event/${id}`);
  };

  return (
    <div className="relative w-full overflow-hidden bg-black-800 mt-24">
      {/* Slides */}
      <div
        className="flex transition-transform ease-in-out duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          // console.log(banner),
          <div className="min-w-full box-border p-1 relative" key={index}>
            <img
              src={banner.poster}
              alt={`Banner ${index + 1}`}
              className="w-full block rounded-xl h-[480px] object-cover shadow-lg"
              onClick={() => handleImageClick(banner._id)}
              style={{ cursor: 'pointer' }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl flex flex-col justify-end p-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2 drop-shadow-lg">{banner.eventName || banner.title || "BigEvents"}</h2>
              {banner.date && (
                <p className="text-lg text-gray-200 mb-4 font-semibold">{new Date(banner.date).toLocaleDateString()}</p>
              )}
              {banner.venue && (
                <p className="text-md text-gray-300 mb-2">{banner.venue}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-gray-900/80 hover:bg-yellow-400 hover:text-gray-900 text-white p-3 rounded-full shadow-lg transition duration-300 z-10 border-2 border-yellow-400"
        aria-label="Previous Slide"
      >
        &lt;
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-gray-900/80 hover:bg-yellow-400 hover:text-gray-900 text-white p-3 rounded-full shadow-lg transition duration-300 z-10 border-2 border-yellow-400"
        aria-label="Next Slide"
      >
        &gt;
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentIndex(idx); setIsManual(true); setTimeout(() => setIsManual(false), 4000); }}
            className={`w-3 h-3 rounded-full border-2 ${currentIndex === idx ? 'bg-yellow-400 border-yellow-400' : 'bg-gray-700 border-gray-400'} transition-all`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;