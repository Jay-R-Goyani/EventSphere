const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    emailDomain: {
        type: String,
        required: true,
        unique: true,
    },
    collegeRepresentatives: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CollegeRep"
    }, ],
    isdb: { type: Boolean, default: false },
});

module.exports = mongoose.model("College", collegeSchema);