const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const AppError = require("../utils/appError");

require("dotenv").config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ CLOUDINARY CONFIG MISSING! Check your .env file.");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("API Key Exists?", !!process.env.CLOUDINARY_API_KEY);
  console.log("API Secret Exists?", !!process.env.CLOUDINARY_API_SECRET);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "properties", 
        resource_type: "auto",
        transformation: [
          { width: 1200, height: 800, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

exports.uploadUserPhoto = upload.single("image");

exports.uploadPropertyPhotos = upload.array("images", 10);

exports.processUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await uploadToCloudinary(req.file.buffer);
    req.body.image = result.secure_url;
    next();
  } catch (error) {
    console.error("User photo upload error:", error);
    next(new AppError("Image could not be uploaded.", 500));
  }
};

// Process multiple property photos
exports.processPropertyPhotos = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    if (req.body.existingImages) {
      return next();
    }
    return next(
      new AppError("You must upload at least one image for the property.", 400)
    );
  }

  try {
    console.log(`Uploading ${req.files.length} images to Cloudinary...`);

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );

    const results = await Promise.all(uploadPromises);

    req.body.images = results.map((result) => result.secure_url);

    console.log(`Successfully uploaded ${results.length} images`);
    next();
  } catch (error) {
    console.error("Property photos upload error detailed:", error);
    next(new AppError("Images could not be uploaded via Cloudinary.", 500));
  }
};
