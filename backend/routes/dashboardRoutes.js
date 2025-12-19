const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.use(authMiddleware.protect, authMiddleware.restrictTo("Admin"));

router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
