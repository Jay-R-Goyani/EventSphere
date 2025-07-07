const express = require('express');
const router = express.Router();
const adminAuthController = require('../Controller/adminAuth');

// Admin login only
router.post('/login', adminAuthController.login);

module.exports = router;