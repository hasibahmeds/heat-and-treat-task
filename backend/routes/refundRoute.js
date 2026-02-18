import express from "express";
import refundModel from "../models/refundModel.js";
import {
  addRefundAmount,
  deleteRefundAmount,
  getRefunds,
  clearRefunds
} from "../controllers/refundController.js";

const refundRouter = express.Router();

refundRouter.post("/add", addRefundAmount);
refundRouter.post("/delete", deleteRefundAmount);
refundRouter.get("/list", getRefunds);
refundRouter.delete("/clear", clearRefunds);

// Remove single refund
refundRouter.delete("/clear/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await refundModel.findByIdAndDelete(id);
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

export default refundRouter;
