const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadUserPhoto,
  processUserPhoto,
} = require("../middleware/uploadMiddleware");
const router = express.Router();

router.get(
  "/me/stats",
  authMiddleware.protect,
  userController.getEmployeeStats
);

router.use(authMiddleware.protect, authMiddleware.restrictTo("Admin"));

router
  .route("/")
  .get(userController.getAllEmployees)
  .post(uploadUserPhoto, processUserPhoto, userController.createEmployee);

router
  .route("/:id")
  .patch(uploadUserPhoto, processUserPhoto, userController.updateEmployee)
  .delete(userController.deleteEmployee);

module.exports = router;
