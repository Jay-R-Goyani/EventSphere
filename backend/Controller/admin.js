const College = require("../Models/College");
const Event = require("../Models/Event")
const Blog = require("../Models/Blog")

exports.getColleges = async(req, res) => {
    try {
        const colleges = await College.find();
        res.status(200).json(colleges);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getClubs = async(req, res) => {
    try {
        const college = await College.findById(req.params.id).populate('collegeRepresentatives');

        if (!college) {
            return res.status(404).json({ error: "College not found" });
        }
        const response = {
            collegeName: college.name,
            representatives: college.collegeRepresentatives,
        };
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve college details" });
    }
};

exports.getEvents = async(req, res) => {

    try {
        const events = await Event.find({ clubId: req.params.id })
        if (!events) {
            return res.status(404).json({ error: "Event not", events });
        }
        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve events" });
    }
};

exports.getBlogs = async(req, res) => {

    try {
        const blogs = await Blog.find({ clubId: req.params.id })
        if (!blogs) {
            return res.status(404).json({ error: "Blogs not", blogs });
        }
        res.status(200).json({ blogs });
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve events" });
    }
};