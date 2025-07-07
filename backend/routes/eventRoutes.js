const express = require('express');
const multer = require('multer');
const { upload } = require("../middleware/multer");
const authMiddleware = require('../middleware/auth');
const eventListing = require('../Controller/eventListing');
const eventReg = require('../Controller/regcontroller.js');
const router = express.Router();

router.post("/listing", upload.fields([{ name: 'image', maxCount: 1 }]), eventListing.createEvent);
router.get("/participants/:eventId", eventListing.getParticipants);
router.get("/concerts", eventListing.getcontests);
router.get("/:id", eventListing.getEvent);
router.get('/', eventListing.getAllEvents);

router.put('/update/:eventId', upload.fields([{ name: 'image', maxCount: 1 }]), eventListing.updateEvent)
router.get("/hi/:eventId/:userId", eventReg.registerForEvent);
router.get("/hi2/:eventId/:userId", eventReg.registerForEvent2);

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err) {
        return res.status(500).json({ message: 'Server Error', error: err.message });
    }
    next();
});


module.exports = router;