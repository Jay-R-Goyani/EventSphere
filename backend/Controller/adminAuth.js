const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');
const bcrypt = require('bcrypt');

exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({
                _id: admin._id,
                email: admin.email,
                isAdmin: true
            },
            process.env.JWT_SECRET, { expiresIn: '3d' }
        );

        res.json({ token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};