const Property = require("../models/propertyModel");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalProperties = await Property.countDocuments();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const propertiesToday = await Property.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const typeCounts = await Property.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const stats = {
      totalProperties,
      propertiesUploadedToday: propertiesToday,
      propertyTypeCounts: typeCounts.reduce(
        (acc, item) => {
          acc[item._id] = item.count;
          return acc;
        },
        { Residential: 0, Commercial: 0 }
      ),
    };

    res.status(200).json({ status: "success", data: { stats } });
  } catch (error) {
    next(error);
  }
};
