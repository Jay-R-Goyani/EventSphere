import React, { useState, useEffect } from 'react';
import './EventListing.scss';
import TagSelector from './tagSelector';
import EventDescription from './eventDescription';
import Navbar from '../Home/Navbar';
import Footer from '../Home/Footer';
import axios from "axios";
import Cookies from "js-cookie"
const userId = Cookies.get("userId");
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config';

export const EventForm = () => {
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('');
  const [event, setEvent] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const { isEdit } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const [posters, setImage] = useState(null);

  // State for form inputs
  const [eventName, setEventName] = useState('');
  const [price, setPrice] = useState('');
  const [registrationStartDate, setRegistrationStartDate] = useState('');
  const [registrationEndDate, setRegistrationEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState('');
  const [venue, setVenue] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [contactPersonEmail, setContactPersonEmail] = useState('');
  const [contactPersonPhone, setContactPersonPhone] = useState('');

  useEffect(() => {
    if (isEdit !== '0') {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`${config.BACKEND_API || "http://localhost:3000"}/api/event/${isEdit}`);
          const eventData = response.data;
          setEvent(eventData);
          setTags(eventData.tags || []);
          setDescription(eventData.description || '');
          setMode(eventData.mode || '');
          setImageUrl(eventData?.poster || '');
          // Set form input states
          setEventName(eventData.eventName || '');
          setPrice(eventData.price || '');
          setRegistrationStartDate(eventData.registrationStartDate || '');
          setRegistrationEndDate(eventData.registrationEndDate || '');
          setStartTime(eventData.startTime || '');
          setEndTime(eventData.endTime || '');
          setType(eventData.type || '');
          setVenue(eventData.venue || '');
          setCreatedBy(eventData.createdBy || '');
          setContactPersonEmail(eventData.contactPersonEmail || '');
          setContactPersonPhone(eventData.contactPersonPhone || '');
        } catch (error) {
          toast.error('Error fetching event details');
        }
      };
      fetchEventDetails();
    }
  }, [isEdit]);

  const handleTagChange = (selectedTags) => setTags(selectedTags);
  const handleDescriptionChange = (desc) => setDescription(desc);

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    const formData = new FormData();
    formData.append("tags", JSON.stringify(tags)); 
    formData.append("description", description); 
    formData.append("clubId", userId);
    formData.append("mode", mode);

    if (contactPersonPhone.length !== 10) {
      toast.error("Enter valid Phone Number");
      setIsButtonDisabled(false);
      return;
    }

    if (!mode) {
      toast.error("Enter a mode");
      setIsButtonDisabled(false);
      return;
    }

    if (eventName.length <= 3 || eventName.length >= 30) {
      toast.error('Event Name must be between 3 and 30 characters.');
      setIsButtonDisabled(false); 
      return;
    }

    if (venue.length <= 3 || venue.length >= 50) {
      toast.error('Venue must be between 3 and 50 characters.');
      setIsButtonDisabled(false); 
      return;
    }

    const start = new Date(registrationStartDate);
    const end = new Date(registrationEndDate);

    if (end < start) {
      toast.error('Registration End Date cannot be before Start Date');
      setIsButtonDisabled(false);
      return;
    }
    if (start.getTime() === end.getTime()) {
      if (startTime > endTime) {
        toast.error('Registration End time cannot be before Start time');
        setIsButtonDisabled(false);
        return;
      }
    }

    try {
      const url = (isEdit === '0') ? `${config.BACKEND_API || "http://localhost:3000"}/api/event/listing/` : `${config.BACKEND_API || "http://localhost:3000"}/api/event/update/${isEdit}`;

      formData.append("eventName", eventName);
      formData.append("price", price);
      formData.append("registrationStartDate", registrationStartDate);
      formData.append("registrationEndDate", registrationEndDate);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("type", type);
      formData.append("venue", venue);
      formData.append("createdBy", createdBy);
      formData.append("contactPersonEmail", contactPersonEmail);
      formData.append("contactPersonPhone", contactPersonPhone);
      if (posters) {
        formData.append("image", posters);
      }
      let response;
      if (isEdit === '0') {
        response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response.data);
      } else {
        response = await axios.put(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status !== 200 && isEdit === '1') {
        toast.error("Event could not be updated");
        setIsButtonDisabled(false);
      } else {
        toast.success(isEdit === '0' ? "Event submitted successfully" : "Event updated successfully");
        setTimeout(() => {
          navigate("/club-profile");
        }, 1000);
      }
    } catch (error) {
      console.error("Error during event submission", error);
      toast.error("Error during event submission");
      setIsButtonDisabled(false);
    }
  };

  return (
    <>
      <div className="event-form-container">
        <Navbar />
        <ToastContainer />
        <form onSubmit={handleSubmit} className="event-form">
          <h1 className="form-header">{isEdit === '0' ? 'Create a New Event' : 'Edit Event'}</h1>

          <div className="form-section">
            <h2>Basic Details</h2>
            <div className="form-group">
              <label>Event Title</label>
              <input
                type="text"
                name="eventName"
                placeholder="Enter Event Title"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 'bold', fontSize: '2.3vh', color: '#f1c40f' }}>Event Description</label>
              <EventDescription onDescriptionChange={handleDescriptionChange} />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                placeholder="0 for Free"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Registration & Timing</h2>
            <div className="form-group">
              <label>Registration Start Date</label>
              <input
                type="date"
                name="registrationStartDate"
                value={registrationStartDate}
                onChange={(e) => setRegistrationStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Registration End Date</label>
              <input
                type="date"
                name="registrationEndDate"
                value={registrationEndDate}
                onChange={(e) => setRegistrationEndDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Registration Start Time</label>
              <input
                type="time"
                name="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e .target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Registration End Time</label>
              <input
                type="time"
                name="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Event Details</h2>
            <div className="form-group">
              <label>Event Type</label>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Competition">Competition</option>
                <option value="Concert">Concert</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Event Venue</label>
              <input
                type="text"
                name="venue"
                placeholder="Enter Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <TagSelector selectedTags={tags} onTagChange={handleTagChange} />
            </div>

            <div className="form-group">
              <label>Mode of Event</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="Online"
                    checked={mode === "Online"}
                    onChange={handleModeChange}
                  />
                  Online
                </label>
                <label>
                  <input
                    type="radio"
                    name="mode"
                    value="Offline"
                    checked={mode === "Offline"}
                    onChange={handleModeChange}
                  />
                  Offline
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Created By</label>
              <input
                type="text"
                name="createdBy"
                placeholder="Enter Your Name"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Details</h2>
            <div className="form-group">
              <label>Contact Person 1 Email</label>
              <input
                className="text-white"
                type="email"
                name="contactPersonEmail"
                placeholder="Enter Email"
                value={contactPersonEmail}
                onChange={(e) => setContactPersonEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Person 1 Phone</label>
              <input
                className="text-white"
                type="tel"
                name="contactPersonPhone"
                placeholder="Enter Phone Number"
                value={contactPersonPhone}
                onChange={(e) => setContactPersonPhone(e.target.value)}
                required
              />
            </div>

              <div className="form-group">
                <label>Upload Event Poster</label>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  name="poster"
                  accept="image/*"
                  required
                />
              </div>
          </div>

          <div className="form-actions">
    
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`w-full text-gray-900 font-semibold p-3 rounded-md shadow-md transition duration-300 ${isButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'}`}
            >
              {isButtonDisabled ? 'Submitting event...' : isEdit != 0 ? 'Update Event' : 'Submit Event'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};