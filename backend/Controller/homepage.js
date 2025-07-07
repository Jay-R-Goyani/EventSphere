const User = require('../Models/User');
const Event = require('../Models/Event');


exports.getLatest = async(req, res) => {
    try {
        const latestevent = await Event.find({})
            .sort({ listedAt: -1 })
            .limit(3);
        // console.log("latestevent", latestevent);
        res.status(200).json({ latestevent, status: "ok" });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching latest events' });
    }
};

exports.getTrending = async(req, res) => {
    try {
        const trendingEvents = await Event.aggregate([
            { $addFields: { registrationsCount: { $size: "$registrations" } } },
            { $sort: { registrationsCount: -1 } },
            { $limit: 3 }
        ]);
        res.status(200).json({ trendingEvents, status: "ok" });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching trending events' });
    }
};