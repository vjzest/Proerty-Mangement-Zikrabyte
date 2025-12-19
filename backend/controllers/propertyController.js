const Property = require("../models/propertyModel");
const AppError = require("../utils/appError");

exports.getAllPublicProperties = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 6;
    const skip = (page - 1) * limit;

    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (req.query.search) {
      queryObj.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }
    
    if(req.query.type && req.query.type !== 'all') {
        queryObj.type = req.query.type;
    }

    const total = await Property.countDocuments(queryObj);
    const totalPages = Math.ceil(total / limit);

    let query = Property.find(queryObj)
      .populate({ path: "createdBy", select: "name email image" })
      .skip(skip)
      .limit(limit);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const properties = await query;

    res.status(200).json({
      status: "success",
      results: properties.length,
      total,
      page,
      totalPages,
      data: { properties },
    });
  } catch (err) {
    next(new AppError("Could not fetch properties.", 500));
  }
};

exports.getPublicPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate({
      path: "createdBy",
      select: "name email image",
    });
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }
    res.status(200).json({ status: "success", data: { property } });
  } catch (err) {
    next(new AppError("Could not fetch property.", 500));
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const { role } = req.user;
    const { type } = req.body;

    if (role === "Residential Employee" && type !== "Residential") {
      return next(new AppError("You can only create Residential properties.", 403));
    }
    if (role === "Commercial Employee" && type !== "Commercial") {
      return next(new AppError("You can only create Commercial properties.", 403));
    }

    const newProperty = await Property.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ status: "success", data: { property: newProperty } });
  } catch (error) {
    next(error);
  }
};

exports.getAllProperties = async (req, res, next) => {
  try {
    let queryObj = {};
    if (req.user && req.user.role !== "Admin") {
      queryObj.createdBy = req.user.id;
    }

    const properties = await Property.find(queryObj).populate(
      "createdBy",
      "name email image"
    );
    res.status(200).json({
      status: "success",
      results: properties.length,
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }
    res.status(200).json({ status: "success", data: { property } });
  } catch (error) {
    next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }

    if (
      req.user.role !== "Admin" &&
      property.createdBy.toString() !== req.user.id
    ) {
      return next(new AppError("You do not have permission to edit this property.", 403));
    }

    const updateData = { ...req.body };

    // Handle Images
    let finalImages = [];
    if (updateData.existingImages) {
        try {
            finalImages = JSON.parse(updateData.existingImages);
        } catch (e) {
            finalImages = []; // If parsing fails, start fresh
        }
    }
    
    // `req.body.images` is added by `processPropertyPhotos` middleware for new uploads
    if (updateData.images && Array.isArray(updateData.images)) {
        finalImages.push(...updateData.images);
    }
    
    updateData.images = finalImages;
    delete updateData.existingImages; // Clean up temporary field

    // Handle Features array (comes as a string from FormData)
    if (updateData.features && typeof updateData.features === 'string') {
        updateData.features = updateData.features.split(',').map(f => f.trim()).filter(Boolean);
    } else {
        updateData.features = [];
    }
    
    // Convert numbers from string to Number type
    if (updateData.rent) updateData.rent = Number(updateData.rent);
    if (updateData.deposit) updateData.deposit = Number(updateData.deposit);

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email image");

    res.status(200).json({ status: "success", data: { property: updatedProperty } });
  } catch (error) {
    next(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }

    if (
      req.user.role !== "Admin" &&
      property.createdBy.toString() !== req.user.id
    ) {
      return next(new AppError("You do not have permission to delete this property.", 403));
    }

    await Property.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};
