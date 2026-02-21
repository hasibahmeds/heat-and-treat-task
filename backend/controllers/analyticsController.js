// controllers/analyticsController.js

import orderModel from "../models/orderModel.js";

const getDailyStats = async (req, res) => {
  try {
    const stats = await orderModel.aggregate([
      {
        $addFields: {
          localDate: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
              timezone: "Asia/Dhaka"   // ← crucial fix
            }
          }
        }
      },
      {
        $group: {
          _id: "$localDate",
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }   // oldest to newest
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalRevenue: 1,
          totalOrders: 1
        }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("Daily stats error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch daily stats" });
  }
};

export { getDailyStats };