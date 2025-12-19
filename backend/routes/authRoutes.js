const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadUserPhoto,
  processUserPhoto,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.use(authMiddleware.protect);

router.patch(
  "/update-me",
  uploadUserPhoto,
  processUserPhoto,
  authController.updateMyDetails
);
router.patch("/update-password", authController.updateMyPassword);

module.exports = router;
