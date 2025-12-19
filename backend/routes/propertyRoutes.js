const express = require("express");
const propertyController = require("../controllers/propertyController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadPropertyPhotos,
  processPropertyPhotos,
} = require("../middleware/uploadMiddleware");
const router = express.Router();

router.get("/public", propertyController.getAllPublicProperties);
router.get("/public/:id", propertyController.getPublicPropertyById);

router.use(authMiddleware.protect);

router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    uploadPropertyPhotos,
    processPropertyPhotos,
    propertyController.createProperty
  );

router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(
    uploadPropertyPhotos,
    processPropertyPhotos,
    propertyController.updateProperty
  )
  .delete(propertyController.deleteProperty);

module.exports = router;