const express = require("express");
const router = express.Router();
const controller = require('../Controller/admin');
const adminAuth = require('../middleware/adminAuth');

// All admin routes are now protected
router.get('/colleges', adminAuth, controller.getColleges);
router.get('/clubs/:id', adminAuth, controller.getClubs);
router.get('/events/:id', adminAuth, controller.getEvents)
router.get('/blogs/:id', adminAuth, controller.getBlogs)

module.exports = router;