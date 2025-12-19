const Inquiry = require("../models/inquiryModel");
const AppError = require("../utils/appError");

exports.createInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message, propertyId, agentId } = req.body;
    if (!name || !email || !phone || !message || !propertyId || !agentId) {
      return next(new AppError("All fields are required.", 400));
    }

    const newInquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      property: propertyId,
      agent: agentId,
    });

    res.status(201).json({
      status: "success",
      data: {
        inquiry: newInquiry,
      },
    });
  } catch (err) {
    next(new AppError("Could not send inquiry, please try again.", 500));
  }
};

exports.getAllInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find()
      .populate({ path: "property", select: "title location" })
      .populate({ path: "agent", select: "name email" })
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: inquiries.length,
      data: {
        inquiries,
      },
    });
  } catch (err) {
    next(new AppError("Could not fetch inquiries.", 500));
  }
};
