const express = require("express");
const router = express.Router();
const controller = require('../Controller/authcollegeprofile')
const collegeController = require("../Controller/authCollege")

router.get('/:userId', controller.getCollegeById);

router.post("/club-signup", controller.signup);
router.post("/club-verify", controller.verifyOTP);

router.delete("/delete/:userId", controller.deletecollegebyId);
router.delete("/deletecolleges", collegeController.Deletecolleges)

router.post('/college-forgot-password/send-otp', collegeController.forgotPasswordSendOtp);
router.post('/college-forgot-password/verify-otp', collegeController.forgotPasswordVerifyOtp);
router.post('/college-forgot-password/reset', collegeController.forgotPasswordReset);

module.exports = router;