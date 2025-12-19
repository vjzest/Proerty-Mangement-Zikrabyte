const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const inquiryRouter = require('./routes/inquiryRoutes');


const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:3000","https://proerty-mangement-zikrabyte-u8eu.vercel.app"]
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use('/api/v1/inquiries', inquiryRouter);


// Health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// 404
app.use((req, res) => {
  res.status(200).json({
    status: "Success",
    message: `Server Runing Successfully ${req.originalUrl}`,
  });
});

module.exports = app;
