import orderModel from "../models/orderModel.js";

const getDailyStats = async (req, res) => {
  try {
    const stats = await orderModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: stats });
  } catch (err) {
    res.json({ success: false });
  }
};

export { getDailyStats };