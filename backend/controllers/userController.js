const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

exports.getEmployeeStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Property.aggregate([
      {
        $match: { createdBy: userId },
      },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          totalRevenue: { $sum: "$rent" },
        },
      },
    ]);

    const defaultStats = {
      totalProperties: 0,
      activeListings: 0,
      totalRevenue: 0,
    };

    const result = stats.length > 0 ? stats[0] : defaultStats;

    const finalStats = {
      totalProperties: result.totalProperties,
      activeListings: result.totalProperties,
      totalRevenue: result.totalRevenue,
    };

    res.status(200).json({
      status: "success",
      data: {
        stats: finalStats,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: { $ne: "Admin" } });
    res.status(200).json({
      status: "success",
      results: employees.length,
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: "fail",
        message: "All fields required",
      });
    }

    const employee = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      role,
      image,
    });

    employee.password = undefined;

    res.status(201).json({
      status: "success",
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    if (req.body.password) {
      return res.status(400).json({
        status: "fail",
        message: "Password update not allowed here",
      });
    }

    const employee = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: "Employee not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: "Employee not found",
      });
    }

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
