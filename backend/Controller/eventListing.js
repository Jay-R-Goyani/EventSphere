const cloudinary = require('../config/cloudinary');
const Event = require('../Models/Event');
const User = require('../Models/User');
const { uploadOnCloudinary } = require("../config/cloudinary");
const { upload2 } = require("../middleware/multer");
// const { get } = require('mongoose');

exports.getParticipants = async(req, res) => {
    try {
        // console.log("Participants page", req.params.eventId)
        const participants = await Event.findOne({ _id: req.params.eventId }).populate({
            path: 'registrations',
            populate: {
                path: 'additionalDetails',
                model: 'UserProfile',
            },
        });

        // console.log("Participants", participants)
        // participants.registrations.populate('additionalDetails')

        // console.log("Participants fetched")

        if (!participants) {
            return res
                .status(404)
                .json({ error: "Partcipant not found" });
        }
        res
            .status(200)
            .json({ participants });


    } catch (err) {
        res
            .status(500)
            .json({ error: "Failed to retrieve participants" });

    }
}

exports.createEvent = async(req, res) => {
    try {
        const {
            eventName,
            description,
            price,
            registrationStartDate,
            registrationEndDate,
            startTime,
            endTime,
            type,
            tags,
            createdBy,
            mode,
            venue,
            contactPersonEmail,
            contactPersonPhone,
            clubId,
        } = req.body;

        if (!eventName ||
            !description ||
            !registrationStartDate ||
            !registrationEndDate ||
            !createdBy ||
            !clubId
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const uploadedFile = req.files && req.files.image && req.files.image[0] ? req.files.image[0] : undefined;
        if (!uploadedFile) {
            return res.status(400).json({ message: "No poster file uploaded" });
        }

        const uploadResult = await uploadOnCloudinary(uploadedFile.buffer, "image");
        if (!uploadResult || !uploadResult.secure_url) {
            return res.status(500).json({ message: "Failed to upload poster to Cloudinary" });
        }

        const parsedTags = tags ? JSON.parse(tags) : [];
        const newEvent = new Event({
            eventName,
            description,
            price: price || 0,
            poster: uploadResult.secure_url,
            listedAt: new Date(),
            registrationStartDate: new Date(registrationStartDate),
            registrationEndDate: new Date(registrationEndDate),
            startTime: startTime || null,
            endTime: endTime || null,
            type,
            tags: parsedTags,
            createdBy,
            mode,
            venue,
            contactPersonEmail,
            contactPersonPhone,
            clubId,
        });

        await newEvent.save();

        res.status(201).json({
            message: "Event created successfully!",
            event: newEvent,
        });
    } catch (error) {
        console.error("Error creating event:", error.message);
        res.status(500).json({
            message: "An error occurred while creating the event",
            error: error.message,
        });
    }
};


exports.updateEvent = async(req, res) => {
    try {
        // console.log("Edit carried out");
        const { eventId } = req.params;

        const { tags, description, eventName, price, type, venue, createdBy, mode, registrationStartDate, registrationEndDate, startTime, endTime, contactPersonEmail, contactPersonPhone } = req.body;
        const uploadedFile = req.files && req.files.image && req.files.image[0] ? req.files.image[0] : undefined;
        if (!uploadedFile) {
            return res.status(400).json({ message: "No poster file uploaded" });
        }

        const uploadResult = await uploadOnCloudinary(uploadedFile.buffer, "image");
        if (!uploadResult || !uploadResult.secure_url) {
            return res.status(500).json({ message: "Failed to upload poster to Cloudinary" });
        }
        const parsedTags = tags ? JSON.parse(tags) : [];
        const updatedEvent = await Event.findOneAndUpdate({ _id: eventId }, {
            description: description,
            eventName: eventName,
            price: price,
            poster: uploadResult.secure_url,
            type: type,
            venue: venue,
            createdBy: createdBy,
            mode: mode,
            registrationStartDate: registrationStartDate,
            registrationEndDate: registrationEndDate,
            startTime: startTime,
            endTime: endTime,
            contactPersonEmail: contactPersonEmail,
            contactPersonPhone: contactPersonPhone,
            tags: parsedTags
        }, { new: true });

        // console.log("Updated Event:", updatedEvent);
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent,
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Error updating event", error });
    }
};

exports.getcontests = async(req, res) => {
    try {
        const concerts = await Event.find({ type: "Concert" }, 'poster');
        res.status(200).json(concerts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch concert events" });
    }
}
exports.getEvent = async(req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Helper functions for default times
const getDefaultStartTime = () => {
    const now = new Date();
    now.setHours(9, 0, 0, 0); // Default start time at 9:00 AM
    return now;
};

const getDefaultEndTime = () => {
    const now = new Date();
    now.setHours(17, 0, 0, 0); // Default end time at 5:00 PM
    return now;
};

exports.getAllEvents = async(req, res) => {
    try {
        let filter = {};
        // Parse filters from query params
        if (req.query.selectedTags) {
            const tags = JSON.parse(req.query.selectedTags);
            if (Array.isArray(tags) && tags.length > 0) {
                filter.tags = { $in: tags };
            }
        }
        if (req.query.selectedTypes) {
            const types = JSON.parse(req.query.selectedTypes);
            if (Array.isArray(types) && types.length > 0) {
                filter.type = { $in: types };
            }
        }
        if (req.query.searchQuery) {
            filter.eventName = { $regex: req.query.searchQuery, $options: 'i' };
        }
        const events = await Event.find(filter).sort({ listedAt: -1 });
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};