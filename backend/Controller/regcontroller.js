const User = require("../Models/User");
const Event = require("../Models/Event");
const UserProfile = require("../Models/UserProfile");
const CollegeRep = require("../Models/CollegeRep");
const College = require("../Models/College"); // Import CollegeRep model

// Event Registration Controller
exports.registerForEvent = async(req, res) => {
    try {
        // console.log("Hello");
        const { eventId, userId } = req.params;
        // const userId = req.user.id; // Assumes the user ID is provided by the auth middleware
        // Fetch event details
        const event = await Event.findOne({ _id: eventId }).populate("clubId"); // Populate clubId to get the CollegeRep details
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }


        // Check registration dates
        const currentDate = new Date();

        // Parse registration start and end dates
        const registrationStartDate = new Date(event.registrationStartDate);
        const registrationEndDate = new Date(event.registrationEndDate);

        if (currentDate.toDateString() === registrationStartDate.toDateString()) {
            if (currentDate.getTime() < event.startTime) {
                return res.status(400).json({ message: "Registration has not started yet." });
            }
        } else if (currentDate.toDateString() === registrationEndDate.toDateString()) {
            if (currentDate.getTime() > event.endTime) {
                return res.status(400).json({ message: "Registration is already closed." });
            }
        } else if (
            currentDate < registrationStartDate || currentDate > registrationEndDate
        ) {
            return res.status(400).json({ message: "Registration is not open for this event." });
        }

        // Fetch user details
        const user = await User.findOne({ _id: userId }).populate("college");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user is already registered
        if (event.registrations.includes(userId)) {
            return res.status(400).json({ message: "You are already registered for this event." });
        }

        // Check if user is verified
        if (!user.isVerified) {
            // return res.status(200).json({ message: "User is not verified. Verification required to register for this event." });
            // diffCollege: true

            return res.status(200).json({
                message: "Please verify your college in profile section or Payment is required to register for this event.",
                diffCollege: true
            });
        }

        // Check if the user's college matches the event's club's college
        const userCollege = (user.college && user.college._id) ? user.college._id.toString() : undefined;
        const eventCollege = (event.clubId.college && event.clubId.college._id) ? event.clubId.college._id.toString() : undefined;

        if (userCollege !== eventCollege) {
            return res.status(200).json({
                message: "You are from a different college. Payment is required to register for this event.",
                diffCollege: true
            });
        }

        // Register the user
        event.registrations.push(userId);
        await event.save();

        user.participated.push(eventId);
        await user.save();

        res.status(200).json({ message: "Registration successful", event });
    } catch (error) {
        console.error("Error during event registration:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
};
exports.registerForEvent2 = async(req, res) => {
    try {
        // console.log("Hello");
        const { eventId, userId } = req.params;
        // const userId = req.user.id; // Assumes the user ID is provided by the auth middleware
        // // Fetch event details
        const event = await Event.findOne({ _id: eventId }).populate("clubId"); // Populate clubId to get the CollegeRep details
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const user = await User.findOne({ _id: userId }).populate("college");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (event.registrations.includes(userId)) {
            return res.status(400).json({ message: "You are already registered for this event." });
        }


        event.registrations.push(userId);
        await event.save();
        // console.log(1);

        // Add the event to the user's participated array
        const userProfile = await User.findOne({ _id: userId }); // Assuming you have a user reference in UserProfile
        if (!userProfile) {
            return res.status(404).json({ error: "User profile not found" });
        }

        user.participated.push(eventId);
        await user.save();
        // console.log(1);

        res.status(200).json({ message: "Registration successful", event });
    } catch (error) {
        console.error("Error during event registration:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
};