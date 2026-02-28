import express from "express";
import {
  addRefundAmount,
  deleteRefundAmount,
  getRefunds,
  clearRefunds,
  removeRefund
} from "../controllers/refundController.js";

const refundRouter = express.Router();

refundRouter.post("/add", addRefundAmount);
refundRouter.post("/delete", deleteRefundAmount);
refundRouter.get("/list", getRefunds);
refundRouter.delete("/clear", clearRefunds);

// ✅ REMOVE SINGLE
refundRouter.delete("/remove/:id", removeRefund);

export default refundRouter;
