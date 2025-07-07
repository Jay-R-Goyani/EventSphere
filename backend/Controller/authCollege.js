const College = require("../Models/College");
const CollegeRep = require("../Models/CollegeRep");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../Models/OTP");
const mailSender = require("../utils/mailsender");
const { VERIFICATION_EMAIL_TEMPLATE } = require("../utils/emailTemplates");
const nodemailer = require("nodemailer")
const { validateUser } = require("../utils/Uservalidator");
const { deleteOne } = require("../Models/Admin");

const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

exports.signup = async(req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            emailDomain,
        } = req.body;

        if (!name || !email || !password || !confirmPassword || !emailDomain) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const existingCollege = await College.findOne({ email });
        if (existingCollege) {
            if (existingCollege.isdb === false) {
                await College.deleteOne({ _id: existingCollege._id });
            } else {
                return res.status(400).json({ message: "College email already registered." });
            }
        }

        const existingCollegeDomain = await College.findOne({ emailDomain });
        if (existingCollegeDomain) {
            return res.status(400).json({ message: "College email domain already registered." });
        }

        const { error } = validateUser({ password });
        if (error) {
            const passwordError = error.details.find((err) => err.context.key === "password");
            if (passwordError) {
                return res.status(400).json({ message: passwordError.message });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const college = new College({
            name,
            email,
            password: hashedPassword,
            emailDomain,
            collegeRepresentatives: []
        });
        console.log("college", college);

        await college.save();
        await sendotpVerificationEmail({ _id: college._id, email: college.email }, res);

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const college = await College.findOne({ email });
        if (!college) {
            const club = await CollegeRep.findOne({ email });

            if (!club) {
                return res.status(404).json({ error: "Club not found!" });
            }
            if (club.isdb == false) {
                await club.deleteOne({ _id: club._id });
                return res.status(400).json({ message: "User not verified" });
            }
            const isPasswordValid = await bcrypt.compare(password, club.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Invalid password" });
            }

            const token = jwt.sign({ userId: club._id, type: 'club' }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            return res.status(200).json({
                message: "Login successful",
                token,
                representative: {
                    id: club._id,
                    email: club.clubemail,
                    club: club.clubName,
                },
            });
        }

        if (!college.isdb) {
            await OTP.deleteMany({ userId: college._id });
            await College.deleteOne({ _id: college._id });
            return res.status(403).json({ error: "Your college email is not verified. Please verify your email before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(password, college.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: college._id, type: 'college' }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({
            message: "Login successful",
            token,
            representative: {
                id: college._id,
                email: college.email,
                college: college.name,
            },
        });
    } catch (error) {
        console.error("Error in college login:", error);
        res.status(500).json({ error: "Server error" });
    }
};


const sendotpVerificationEmail = async({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: "eventsphereandteam@gmail.com",
            to: email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp)
        };
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newotpVerification = new OTP({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        await newotpVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: _id,
                email: email,
            },
        });
    } catch (error) {
        console.error("[EMAIL DEBUG] Error sending email:", error);
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};

module.exports.verifyOTP = async(req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            await College.deleteOne({ _id: userId });
            throw new Error("Empty OTP details are not allowed");
        }

        const userOTPRecords = await OTP.find({ userId });

        if (userOTPRecords.length <= 0) {
            throw new Error("Account record doesn't exist or has been verified already. Please sign up or log in.");
        }

        const expiresAt = userOTPRecords[0].expiresAt;
        const hashedOTP = userOTPRecords[0].otp;

        if (expiresAt < Date.now()) {
            await OTP.deleteMany({ userId });
            throw new Error("Code has expired. Please request again.");
        }

        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            await College.deleteOne({ _id: userId });
            throw new Error("Invalid OTP. Please try again.");
        }
        await College.findByIdAndUpdate(
            userId, { $set: { isdb: true } }, { new: true }
        )

        await OTP.deleteMany({ userId });

        res.json({
            status: "VERIFIED",
            message: "College email verified successfully."
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports.Deletecolleges = async(req, res) => {
    try {
        await College.deleteMany({ isdb: false });
        res.status(200).json({
            message: `colleges with isDb = false have been deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting colleges:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

// Forgot Password: Send OTP for College
exports.forgotPasswordSendOtp = async(req, res) => {
    try {
        const { email } = req.body;
        const college = await College.findOne({ email });
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newotpVerification = new OTP({
            userId: college._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });
        await newotpVerification.save();
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Reset Your Password - OTP',
            html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`
        };
        await mailSender(email, mailOptions.subject, mailOptions.html);
        res.json({
            status: 'PENDING',
            message: 'OTP sent to your email',
            data: { userId: college._id, email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

exports.forgotPasswordVerifyOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;
        const college = await College.findOne({ email });
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        const userOTPRecords = await OTP.find({ userId: college._id });
        if (userOTPRecords.length <= 0) {
            return res.status(400).json({ message: "No OTP record found. Please request again." });
        }
        const expiresAt = userOTPRecords[0].expiresAt;
        const hashedOTP = userOTPRecords[0].otp;
        if (expiresAt < Date.now()) {
            await OTP.deleteMany({ userId: college._id });
            return res.status(400).json({ message: "Code has expired. Please request again." });
        }
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            await OTP.deleteMany({ userId: college._id });
            return res.status(401).json({ message: "Invalid OTP. Redirecting to login.", redirect: true });
        }
        await OTP.deleteMany({ userId: college._id });
        return res.json({ status: 'VERIFIED', message: 'OTP verified. You can now reset your password.' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

exports.forgotPasswordReset = async(req, res) => {
    try {
        const { email, newPassword } = req.body;
        //console.log('[RESET DEBUG] Received request for email:', email);
        const college = await College.findOne({ email });
        if (!college) {
            console.log('[RESET DEBUG] College not found for email:', email);
            return res.status(404).json({ message: 'College not found' });
        }
        // Validate password constraints
        const { error } = validateUser({ password: newPassword });
        if (error) {
            const passwordError = error.details.find((err) => err.context.key === "password");
            // console.log('[RESET DEBUG] Password validation failed:', passwordError ? passwordError.message : error.message);
            return res.status(400).json({ message: passwordError ? passwordError.message : "Password does not meet criteria" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        college.password = hashedPassword;
        await college.save();
        // console.log('[RESET DEBUG] Password reset successful for email:', email);
        res.json({ status: 'SUCCESS', message: 'Password reset successful.' });
    } catch (error) {
        console.error('[RESET DEBUG] Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};