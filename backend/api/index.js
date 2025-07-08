const express = require('express');
const cors = require('cors');
require("dotenv").config();
const connectDb = require("../config/dbconnection");


const app = express();
const FrontendApi = process.env.FRONTEND_API;

const corsOptions = {
    origin: [FrontendApi , "https//localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const user = require("../routes/user");
const blogRoutes = require('../routes/blogRoutes');
const crud = require('../routes/crud');
const college = require('../routes/college');
const eventRoutes = require("../routes/eventRoutes");
const homepageRoutes = require("../routes/homepageRoutes");
const collegeRep = require('../routes/collegeRep');
const adminroutes = require("../routes/adminroutes");
const adminAuthRoutes = require("../routes/adminAuth");

app.get('/', (req, res) => {
    res.send("Backend is live!");
});

app.use("/api/auth", user);
app.use("/api/blog", blogRoutes);
app.use("/api/users", crud);
app.use("/api/college", college);
app.use("/api/event", eventRoutes);
app.use("/api/asd", eventRoutes)
app.use("/api/home", homepageRoutes);
app.use("/api/collegeRep", collegeRep);
app.use("/api/admin", adminroutes);
app.use("/api/admin-auth", adminAuthRoutes);


const PORT = process.env.PORT || 3000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

module.exports = app;