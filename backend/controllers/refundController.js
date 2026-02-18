import refundModel from "../models/refundModel.js";

// Add amount
const addRefundAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    const refund = await refundModel.create({
      addedAmount: amount,
      addedAt: new Date(),
    });

    res.json({ success: true, data: refund });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding amount" });
  }
};

// Delete amount
const deleteRefundAmount = async (req, res) => {
  try {
    const { amount } = req.body;

    const refund = await refundModel.create({
      deletedAmount: amount,
      deletedAt: new Date(),
    });

    res.json({ success: true, data: refund });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting amount" });
  }
};

// Get all refunds
const getRefunds = async (req, res) => {
  try {
    const refunds = await refundModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: refunds });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// Clear all refunds
const clearRefunds = async (req, res) => {
  try {
    await refundModel.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// ✅ REMOVE SINGLE REFUND
const removeRefund = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await refundModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "Refund not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing refund" });
  }
};

export {
  addRefundAmount,
  deleteRefundAmount,
  getRefunds,
  clearRefunds,
  removeRefund
};
